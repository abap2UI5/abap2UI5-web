# web-abap2UI5-build

**This repository is a build artifact. Do not edit it — every deploy replaces
its entire content (`force_orphan: true`), including anything committed here
by hand.**

The whole abap2UI5 backend, downported, transpiled to JavaScript and bundled
into a single script that runs inside the browser tab: SQLite compiled to wasm
stands in for the database, the frontend HTML is served by the transpiled
`z2ui5_cl_http_handler` in-process, and there is no server behind it at all.

**Live: <https://abap2ui5.github.io/web-abap2UI5-build/>**

| | |
|---|---|
| Built by | [abap2UI5/web-abap2UI5](https://github.com/abap2UI5/web-abap2UI5) — workflow `build_web.yaml`, daily |
| Built from | [abap2UI5](https://github.com/abap2UI5/abap2UI5) + [samples](https://github.com/abap2UI5/samples) — `BUILD_INFO.json` names the exact commits |
| Report a problem | with the browser build: [web-abap2UI5](https://github.com/abap2UI5/web-abap2UI5/issues) · with the framework: [abap2UI5](https://github.com/abap2UI5/abap2UI5/issues) |

Do not open issues or pull requests here — nothing in this repository is a
source file.

## What is in here

| File | What it is |
|---|---|
| `index.html`, `app.bundle.js` | the webpack bundle: transpiled backend, runtime and boot code |
| `sql-wasm-browser.wasm` | SQLite (sql.js), standing in for the database |
| `css/style.css` | the stylesheet the z2ui5 frontend manifest asks for |
| `BUILD_INFO.json` | provenance: the upstream commits and the run this build came from |
| `build-stamp.txt` | the same three commits as `<abap2UI5>-<samples>-<web-abap2UI5>`; the daily build reads it back to skip rebuilding unchanged inputs |
| `404.html` | redirects stray paths back to the app |

Each commit here is one deployment, so `git log` is the deployment history.
