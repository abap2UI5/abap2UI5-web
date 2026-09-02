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
| `ci/` | transpile + downport config, the gates that keep them in lockstep with upstream, and the post-processing patches (below) |
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

- **The `z2ui5_if_exit` copy-back in `clone:core`** (`package.json`). The clone
  drops upstream's frozen `src/99` package, but one object in it is not dead
  weight: `src/01/04/z2ui5_cl_ui5_user_exit` still declares a reference of type
  `z2ui5_if_exit` and its test class still implements the interface, because
  upstream keeps the superseded exit name working while the rename to
  `z2ui5_if_ui5_exit` settles. Deleting the whole package therefore breaks the
  downport with 10 unresolved-type / check_syntax errors — which is what every
  scheduled build did from 2026-08-22 on, the morning after upstream retired
  the interface into `src/99`. The interface (plus the package's
  `package.devc.xml`) is copied back and nothing else; its three types are
  declared AS the ones on `z2ui5_if_ui5_exit`, so it drags no further
  dependency in. When upstream finally deletes `z2ui5_if_exit`, this copy-back
  goes with it.

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

- **The Request branch of the fetch override** (`app/web.mjs`). The override
  routes a `fetch()` addressed to this page into the transpiled backend, and it
  has to recognize the target in all three argument shapes the Fetch API takes:
  a string, a `URL` — and a `Request`. The last one is not hypothetical.
  OpenUI5 1.152 ships `sap/ui/performance/FetchInterceptor`, which wraps
  whatever `globalThis.fetch` is when it loads (this override) and always calls
  it as `fetch(new Request(...))`, folding the init object into the request. A
  string-or-URL-only test therefore stopped matching, every backend POST fell
  through to the network and came back as the static server's 404
  `Cannot POST /`: the page booted, rendered nothing and answered no button.
  Nothing in this repository or upstream changed that day — the page boots UI5
  from the *cachebuster* URL, so the CDN flipping to 1.152 was enough to turn
  the same commit red. For the same reason `backendFetch` answers with a real
  `Response` and not a duck-typed look-alike: the interceptor hands the
  returned object to its `onResponse` hooks, which `clone()` it.

- **`ci/patch_diss_oref.mjs`**. `DISS_OREF` resolves attribute chains through
  the *dynamic* type in the transpiler runtime, so `dissolve()` walks from the
  app's `CLIENT` down into the framework core and the draft save clears the
  core app's own `MT_ATTRI` — every follow-up request then dies with "LOOP at
  undefined" on the first button press. The guard skips framework core
  instances only, named class by class: `Z2UI5_CL_UI5_*` as a wildcard would
  also catch the demo *apps*, whose attributes must be dissolved.

- **The abaplint downport shim** (`abap2UI5/node/setup/patch-abaplint-downport.mjs`,
  called from `build:downport` against *this* repo's `@abaplint/cli` bundle).
  Stock abaplint outlines a component-level table expression
  (`tab[ 1 ]-comp`) into a work AREA — a copy — so the row reference is gone
  by the time the framework sees it, and `client->_bind( tab = … tab_index = … )`
  refuses the cell with `BINDING_ERROR_TAB_CELL_LEVEL`. The shim makes the
  outline `ASSIGNING`, which is what the same abaplint rule's write path
  already emits.

  It is upstream's script, run from the clone `clone:core` already makes,
  never a copy: it is a temporary shim for an abaplint defect and it must
  disappear from every consumer on the same day. The bundle path is passed
  explicitly because the clone has no `node_modules` of its own — the default
  would silently patch nothing here.

  The canary is upstream's own `test_bind_tab_cell` (`z2ui5_cl_ui5_client`
  test class), which `npm test` runs: without the shim that test is the one
  red line in an otherwise green suite. That is how this was found — upstream
  added the cell binding on 2026-08-30 and this pipeline, which downports the
  same sources with a different abaplint install, had no shim to apply.

- **`ci/merge_transpile_skips.mjs`, and the empty `skip` array it fills**
  (`ci/abap_transpile.json`). A few abap2UI5 unit tests cannot pass under the
  transpiler — they cover behaviour the NodeJS runtime does not reproduce
  (a dynamic `describe_by_name`, microsecond timestamps, a field-symbol type
  check the runtime does not enforce). abap2UI5 lists them in
  `node/setup/abap_transpile.json`, in the same commit as the test.

  This repository transpiles those same sources and kept a hand-written
  SECOND COPY of that list. The copy is what broke the nightly on 2026-08-03
  (issue #63, `test_tab_ref_gen`) and again on 2026-09-02 (issue #84,
  `test_skip_sorted_table`): upstream added the test and its skip entry
  together, the clone here picked up the test and knew nothing about the
  entry, and the build went red on a test upstream had already declared
  unrunnable. The second time the skip entry was 57 minutes old.

  So the list is read from the clone `clone:core` already makes, never
  copied — same reasoning as the abaplint downport shim above. The checked-in
  `skip` array holds only entries upstream does NOT have; it is empty today
  and an empty array is the correct state, not an oversight. The one entry it
  used to carry alone — `ltcl_parser_test->parse_error`, noted "NodeJS 20 does
  not set position of parsing error" — was stale: the pipeline runs Node 22,
  the test passes, and skipping it had been hiding a green test for as long as
  nobody re-read the note.

  A missing or reshaped upstream list fails the build with a message naming
  the path, because a silent fall back to the local half would be the drift
  again, only quieter.

- **`ci/merge_downport_config.mjs`, and the near-empty
  `ci/abaplint-downport.jsonc` it completes.** Which abaplint rules run
  alongside `downport`, and which syntax version they judge against, is a fact
  about abap2UI5, not about this pipeline: the downport result here has to
  pass the same check as upstream's source. That is the same rule the
  `@abaplint/cli` pin follows under "Pins", and `ci/check-abaplint-pin.mjs`
  already enforces the version half of it.

  The rules half was a hand-written copy of upstream's
  `.github/abaplint/abap_702.jsonc` — and it had already drifted, unnoticed:
  upstream runs `xml_bom`, the copy did not. Nothing would ever have said so.

  So rules and syntax are read from the clone. The checked-in file keeps only
  what is genuinely this pipeline's — `global.files` and the dependency
  folder, whose paths are relative to `ci/` and mean nothing upstream — plus a
  `rules` object for local OVERRIDES, which is empty and correct that way. A
  moved or reshaped upstream config fails the build with the path in the
  message, for the same reason as the skip list above.

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
told to ignore it (`.github/dependabot.yml`). `ci/check-abaplint-pin.mjs`
(run by `npm run clone`, so every build sees it) fails when the pin falls out
of lockstep — the rule was prose only until the pin sat at 2.120.3 while
upstream had long resolved 2.120.33.
