// _init.mjs is rewritten by ci/patch_init_order.mjs (npm run build:transpile) to
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
// Takes the same argument shapes the Fetch API does - (url, init) AND a single
// Request instance - because that is what actually reaches us, see the
// FetchInterceptor note at the override below.
async function backendFetch(input, options = {}) {
  const request = await readRequest(input, options);
  const url = request.url;
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

  const req = {
    // The shim reads req.body.toString("hex"), so this must be a real Buffer
    // (empty for GET/HEAD - Server.endSession sends a body-less HEAD).
    body: request.body,
    method: request.method,
    // express lowercases request header names; the shim iterates them as-is.
    headers: request.headers,
    path: new URL(url, window.location.href).pathname,
    url,
  };

  await abap.Classes["CL_EXPRESS_ICF_SHIM"].run({req, res, class: "ZCL_SICF"});

  // A REAL Response, not a hand-rolled look-alike. The FetchInterceptor below
  // hands whatever this returns to its onResponse hooks, and those call
  // .clone() on it - a duck-typed object with ok/status/text/json survives
  // only for as long as nobody registers a hook. Response also gives the
  // frontend the Headers contract (case-insensitive get, null when absent)
  // for free, which is all the hand-rolled map ever provided.
  // 204/205/304 must be constructed body-less - the ETag path answers 304.
  const hasBody = status !== 204 && status !== 205 && status !== 304;
  return new Response(hasBody ? body : null, {
    status,
    headers: Object.fromEntries(headers),
  });
}

// Read a fetch() call - in either argument shape - down to the four fields
// the ICF shim needs. A Request carries method, headers and body itself, so
// an init object is only consulted for the (url, init) shape.
async function readRequest(input, options) {
  if (isRequest(input)) {
    return {
      url: input.url,
      method: input.method,
      // Headers already lowercases the field names it iterates.
      headers: Object.fromEntries(input.headers),
      // Resolves to an empty buffer for a body-less request (GET/HEAD).
      body: Buffer.from(await input.arrayBuffer()),
    };
  }
  const headers = {};
  for (const [name, value] of Object.entries(options.headers || {})) {
    headers[name.toLowerCase()] = String(value);
  }
  return {
    url: String(input),
    method: options.method || "GET",
    headers,
    body: Buffer.from(options.body || ""),
  };
}

function isRequest(input) {
  return typeof Request !== "undefined" && input instanceof Request;
}

// ---- fetch override: only intercept requests addressed to "this page" ----
// The frontend uses window.location.href as backend URL (checkLocal mode).
// Compare origin + pathname instead of the full href: the hash changes at
// runtime (SET_PUSH_STATE / History control), while sql-wasm.wasm (different
// pathname) and the UI5 CDN (different origin) must reach the network.
//
// The first argument is every shape the Fetch API accepts - a string, a URL,
// AND a Request. The Request shape is not theoretical: OpenUI5 1.152 ships
// sap/ui/performance/FetchInterceptor, which wraps whatever globalThis.fetch
// is when it loads (this override) and calls it as fetch(new Request(...)) -
// "always construct a Request from the arguments", so the init object is
// folded in and never reaches us separately. This page boots UI5 from the
// cachebuster URL, i.e. always the newest release: on the day the CDN flipped
// to 1.152 every backend POST stopped matching a string-or-URL-only test,
// fell through to the network and came back as the static server's 404
// "Cannot POST /" - a page that boots, renders nothing and answers no button.
// The commit that was deployed did not change; the CDN did. That is why the
// browser smoke gate exists.
const nativeFetch = globalThis.fetch.bind(globalThis);

function isBackendUrl(input) {
  const href = isRequest(input) ? input.url
    : (typeof input === "string" || input instanceof URL) ? String(input)
    : null;
  if (href === null) {
    return false;
  }
  try {
    const target = new URL(href, window.location.href);
    return target.origin === window.location.origin
        && target.pathname === window.location.pathname;
  } catch {
    return false;
  }
}

globalThis.fetch = (input, options) =>
  isBackendUrl(input) ? backendFetch(input, options) : nativeFetch(input, options);

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
  // Match the REAL bootstrap tag, which is the one that also carries the
  // data-sap-ui-* attributes. `id="sap-ui-bootstrap"` alone is not enough any
  // more: the framework's developer tools print the string
  //   '  (no <script id="sap-ui-bootstrap"> on this page -'
  // when they cannot find the element, and that literal travels INSIDE the
  // preload of the first script block - earlier in the HTML than the real tag.
  // A regex matching it inserted this shim, `</script>` and all, into the
  // middle of the framework's own JavaScript: the script element ended there,
  // the rest of it was parsed as HTML, onInitComponent was never defined, and
  // UI5's data-sap-ui-oninit called a function that did not exist. The page
  // then sits at a bootstrap element that never runs - which is exactly what
  // the browser smoke reported and what no other check could see.
  const BOOTSTRAP_TAG = /<script[^>]*\bid="sap-ui-bootstrap"[^>]*\bdata-sap-ui-/i;
  if (!BOOTSTRAP_TAG.test(html)) {
    // never ship a silently unshimmed page: a miss here used to corrupt the
    // document instead of leaving it alone
    throw new Error("web.mjs: no sap-ui-bootstrap script tag found in the backend HTML");
  }
  html = html.replace(BOOTSTRAP_TAG, unloadShim + "$&");

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
