// _init.mjs is rewritten by ci/patch_init_order.mjs (npm run transpile) to
// load every transpiled module with a sequential await import(), which
// guarantees the class registration order in every ESM runtime and bundler.
// Webpack still produces a single bundle via dynamicImportMode: "eager".
import {initializeABAP} from "../output/_init.mjs";

// Boot sequence of the all-in-browser demo:
// 1. initialize the transpiled ABAP backend (sql.js database + abap runtime)
// 2. route fetch() calls addressed to this page into the transpiled backend
// 3. GET the frontend HTML from the backend (z2ui5_cl_http_handler->_http_get,
//    the same page a real server serves, including the sap.ui.require.preload
//    of the complete current UI5 frontend) and document.write it.
// This way the webpacked demo always runs the frontend version embedded in
// the freshly cloned backend - no static frontend copy to keep up to date.

await initializeABAP();

// ---- backend fetch: routes a browser fetch into the transpiled ABAP backend ----
async function backendFetch(url, options = {}) {
  let status = 200;
  let body = Buffer.alloc(0);
  const headers = new Map();

  // Fake of the express response object used by CL_EXPRESS_ICF_SHIM: headers
  // arrive one append() per field, then the shim chains .status(..).send(..)
  // with a Buffer.
  const res = {
    append: (name, value) => {
      headers.set(String(name).toLowerCase(), String(value));
    },
    status: (code) => {
      status = Number(code);
      return res;
    },
    send: (data) => {
      body = Buffer.from(data);
    },
  };

  // express lowercases request header names; the shim iterates them as-is.
  const reqHeaders = {};
  for (const [name, value] of Object.entries(options.headers || {})) {
    reqHeaders[name.toLowerCase()] = String(value);
  }

  const req = {
    // The shim reads req.body.toString("hex"), so this must be a real Buffer
    // (empty for GET/HEAD - Server.endSession sends a body-less HEAD).
    body: Buffer.from(options.body || ""),
    method: options.method || "GET",
    headers: reqHeaders,
    path: new URL(url, window.location.href).pathname,
    url: String(url),
  };

  await abap.Classes["CL_EXPRESS_ICF_SHIM"].run({req, res, class: "ZCL_SICF"});

  const text = body.toString();
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: {get: (name) => headers.get(String(name).toLowerCase()) ?? null},
    text: async () => text,
    json: async () => JSON.parse(text),
  };
}

// ---- fetch override: only intercept requests addressed to "this page" ----
// The frontend uses window.location.href as backend URL (checkLocal mode).
// Compare origin + pathname instead of the full href: the hash changes at
// runtime (SET_PUSH_STATE / History control), while sql-wasm.wasm (different
// pathname) and the UI5 CDN (different origin) must reach the network.
const nativeFetch = globalThis.fetch.bind(globalThis);

function isBackendUrl(input) {
  if (typeof input !== "string" && !(input instanceof URL)) {
    return false;
  }
  try {
    const target = new URL(String(input), window.location.href);
    return target.origin === window.location.origin
        && target.pathname === window.location.pathname;
  } catch {
    return false;
  }
}

globalThis.fetch = (input, options) =>
  isBackendUrl(input) ? backendFetch(String(input), options) : nativeFetch(input, options);

// ---- boot: GET the frontend from the transpiled backend, replace the document ----
try {
  console.log("abap2UI5: backend initialized, booting frontend");
  const response = await backendFetch(window.location.href, {method: "GET"});
  let html = await response.text();
  if (!response.ok) {
    throw new Error("backend GET failed with status " + response.status + ": " + html);
  }

  // The backend CSP meta targets server-served pages (no unsafe-eval /
  // wasm-unsafe-eval). Written into this document it would take effect and
  // block the already-running wasm/eval-based runtime, without adding any
  // protection - there is no network backend in this demo. Strip it.
  html = html.replace(/<meta http-equiv="Content-Security-Policy"[\s\S]*?\/>/i, "");

  // UI5's ResizeHandler (and only it) still registers a window "unload"
  // listener, which Chrome's unload deprecation rejects with a console
  // violation ("Permissions policy violation: unload is not allowed in this
  // document"). Rewrite window-level unload listeners to the recommended
  // "pagehide" before the UI5 bootstrap runs - same cleanup moment, no
  // violation. Must be inline in the written HTML: this module's scope does
  // not survive into UI5's synchronous bootstrap parsing order otherwise.
  const unloadShim =
    "<script>(function () {" +
    "var add = window.addEventListener.bind(window);" +
    "var remove = window.removeEventListener.bind(window);" +
    "window.addEventListener = function (type, listener, options) {" +
    "return add(type === 'unload' ? 'pagehide' : type, listener, options);" +
    "};" +
    "window.removeEventListener = function (type, listener, options) {" +
    "return remove(type === 'unload' ? 'pagehide' : type, listener, options);" +
    "};" +
    "})();</" + "script>";
  html = html.replace(/<script[^>]*\bid="sap-ui-bootstrap"/i, unloadShim + "$&");

  // document.open() is a no-op while the initial document is still being
  // parsed - wait until the loader page finished parsing.
  if (document.readyState === "loading") {
    await new Promise((resolve) =>
      document.addEventListener("DOMContentLoaded", resolve, {once: true}));
  }

  // The window (fetch override, abap runtime, sql.js instance) survives the
  // document replacement; the written page boots UI5 from the CDN and runs
  // onInitComponent with the preload of all frontend modules.
  document.open();
  document.write(html);
  document.close();
} catch (error) {
  console.error(error);
  document.body.textContent = "abap2UI5 boot failed: " + (error?.message || error);
}
