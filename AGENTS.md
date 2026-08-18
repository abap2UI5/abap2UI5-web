# AGENTS.md — web-abap2UI5

Guidance for AI agents and contributors. Single source of truth for this
repository's rules. Read before making any change.

## What this repo is

A build pipeline, not a framework. It clones [abap2UI5](https://github.com/abap2UI5/abap2UI5)
and [samples](https://github.com/abap2UI5/samples), downports them with
abaplint, transpiles them to JavaScript with `@abaplint/transpiler`, and
webpacks the result into a single bundle that runs the **whole backend inside
the browser tab** — sql.js stands in for the database. The daily `build_web`
workflow deploys it to [web-abap2UI5-build](https://github.com/abap2UI5/web-abap2UI5-build)
(<https://abap2ui5.github.io/web-abap2UI5-build/>).

Nothing under `src/`, `downport/`, `output/`, `build/` is a source file — all
four are gitignored build products. Framework fixes belong upstream in
abap2UI5, not here.

| Path | What it is |
|---|---|
| `ci/` | downport config + the two post-processing patches (below) |
| `srv/` | Node-side entry points: express host, static build server, `ZCL_SICF` |
| `app/` | browser entry: `web.mjs` (boot), `index.html`, `css/`, `pages/` |
| `app/pages/` | README + 404 page copied into the deploy — the artifact repo's own files |
| `tests/web.spec.js` | the browser smoke gate (Playwright project `chromium-web`) |

## Build & test

```bash
npm run clone       # clone:core + clone:samples into ./src
npm test            # build (downport + transpile) + the transpiled unit tests
npm run build:web   # webpack production build into ./build
npm run test:e2e    # the browser smoke against ./build (needs build:web first)
```

`npm test` is exactly what CI runs as the tests — keep it that way. Script
names are namespaced (`clone:*`, `build:*`, `test:*`, `serve:*`); a new script
joins a namespace rather than inventing a bare name.

## Things that look removable and are not

Each of these was paid for with a broken deploy. The full story is in the
comment at the code; this list exists so nobody deletes one without reading it.

- **`keep_classnames` / `keep_fnames` in the Terser options**
  (`webpack.config.js`). The transpiled ABAP carries its type system in the
  *names*: RTTI (`describe_by_data` and friends) reads class and function
  names off the generated objects. Mangling them makes RTTI derive types from
  `a` and `s`, and the failure surfaces far away as a `CONVT_NO_NUMBER` out of
  a `class_constructor` during boot — a blank page with one console line. Costs
  ~150 KB of the ~2.9 MB minification saves.

- **Stripping the Content-Security-Policy meta tag** (`app/web.mjs`). The
  backend's CSP is written for server-served deployments (no `unsafe-eval` /
  `wasm-unsafe-eval`). Written into this document it would block the already
  running wasm/eval runtime while protecting nothing — there is no network
  backend in this demo.

- **`ci/patch_diss_oref.mjs`**. `DISS_OREF` resolves attribute chains through
  the *dynamic* type in the transpiler runtime, so `dissolve()` walks from the
  app's `CLIENT` down into the framework core and the draft save clears the
  core app's own `MT_ATTRI` — every follow-up request then dies with "LOOP at
  undefined" on the first button press. The guard skips framework core
  instances only, named class by class: `Z2UI5_CL_UI5_*` as a wildcard would
  also catch the demo *apps*, whose attributes must be dissolved.

- **`ci/patch_init_order.mjs`**. The transpiler emits static imports of async
  modules; ES only guarantees they *start* in order, not that each finishes
  before the next starts. Cross-class references made during
  `class_constructor` go through `abap.Classes` and are invisible to the module
  graph. Node happens to work, webpack does not. Rewriting the imports to
  sequential top-level `await import(...)` makes the order deterministic
  everywhere.

- **The three historical spellings of the context class** in
  `ci/patch_diss_oref.mjs` (`z2ui5_cl_abap2ui5_context` →
  `z2ui5_cl_a2ui5_context` → `z2ui5_cl_ui5_util_context`) and the two target
  file names (`z2ui5_cl_core_srv_model` / `z2ui5_cl_ui5_srv_model`). This repo
  builds against upstream's *current* main every night, so a patch that knows
  only one name breaks the daily build on the day upstream renames — which is
  exactly what happened on 2026-08-12. Add new spellings, never replace old
  ones.

- **The browser smoke gate** (`tests/web.spec.js`, run before the deploy).
  Everything upstream of it can be green while the deployed page is blank: a
  bundling or initialization fault only shows when the bundle actually runs.
  It also caught the bootstrap-tag regex matching a string *inside* the
  preload, see the comment in `app/web.mjs`.

## Deploy

`build_web.yaml` deploys `./build` with `force_orphan: true`, so the published
repository is exactly what `./build` contains — files committed there by hand
are gone with the next run. Anything visitors should find ships from
`app/pages/` and the copy step in the workflow.

`build-stamp.txt` is not documentation: the scheduled run curls it back from
the deployed site and compares it as one opaque string to decide whether the
inputs changed. Do not change its format or filename without teaching the read
side to also understand the *old*, already deployed shape — otherwise the first
run after the change compares against something it cannot parse.
`BUILD_INFO.json` is the human-readable companion and is read by nobody.

## Pins

`@abaplint/cli` is pinned exactly (no caret) to the version abap2UI5 itself
syntax-checks with — the downport result has to pass the same check as
upstream's source. Bump it together with abap2UI5's pin, by hand; Dependabot is
told to ignore it (`.github/dependabot.yml`).
