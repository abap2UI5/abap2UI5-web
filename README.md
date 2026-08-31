## web-abap2UI5

**Live demo: [abap2ui5.github.io/web-abap2UI5-build](https://abap2ui5.github.io/web-abap2UI5-build/)** — the
complete abap2UI5 backend, downported, transpiled to JavaScript and running
inside your browser tab. No server, no SAP system.

The build is rebuilt daily from the current abap2UI5 and samples sources and
deployed to [web-abap2UI5-build](https://github.com/abap2UI5/web-abap2UI5-build)
(GitHub Pages). Contributor and agent guidance lives in [AGENTS.md](AGENTS.md).

### Functionality
* Downporting with [abaplint](https://abaplint.org/)
* Transpiling to JS with [abaplint/transpiler](https://github.com/abaplint/transpiler)
* Running on Node.js with [open-abap](https://github.com/open-abap/open-abap)
* Service exposing via [express-icf-shim](https://github.com/open-abap/express-icf-shim)
* Running the same backend **in the browser**: webpack bundles the transpiled
  ABAP into one script and [sql.js](https://sql.js.org/) (SQLite compiled to
  wasm) stands in for the database, so the demo needs no server at all — it is
  a static GitHub Pages site

### Tasks
##### Downport & Transpile
```
npm run clone
npm run build
```
##### Run Unit Tests
```
npm test          # clone once, then: downport + transpile + unit tests
npm run test:unit # only the transpiled unit tests, on an existing ./output
```
`npm test` is exactly what CI runs as "the tests".

##### Run Webservice
The transpiled backend on Node.js, served by express on port 3000. Started by
hand — it is not part of any test run:
```
npm run serve:express
```

##### Webpack Build Strategy

1. Clone repositories into /src/
2. Downport /src/ into /downport/
3. Transpile with express-icf-shim into /output/
4. Webpack backend + database into folder build

```
npm run build:web
```

The bundle contains no static frontend copy: at runtime `app/web.mjs` initializes the transpiled backend, issues an in-memory HTTP GET against it (the same `z2ui5_cl_http_handler` GET that serves real systems, including the `sap.ui.require.preload` of the complete current UI5 frontend) and `document.write`s the returned page. Frontend and backend are therefore always the versions cloned that day. The backend's Content-Security-Policy meta tag is stripped from the written page — it is designed for server-served deployments (no `unsafe-eval`/`wasm-unsafe-eval`) and would break the wasm/eval-based in-browser runtime while protecting nothing here.

Test the build locally (webpack-dev-server HMR does not work with the `document.write` boot):

```
npm run serve:build
```

### Media Pipeline

Record any abap2UI5 app as video and screenshot — post-ready assets for
LinkedIn, docs and READMEs:

```
npm run media -- --app <app-class>
```

By default this records the app on the published web build above; `--url`
points it at any other page that starts apps via `?app_start=` (a local
`serve:build`, a real system). `--steps <file>` replays a scripted
interaction ([media/steps.example.json](media/steps.example.json)), `--size`
switches between desktop, phone and tablet viewports. Output per app:
`.webm` and `.png` always, `.mp4` (what LinkedIn ingests best) and `.gif`
when ffmpeg is installed. [media/record.mjs](media/record.mjs) documents
all options, including offline recording via `--ui5-from`.

### CI
The `build_web` workflow runs daily: it clones [abap2UI5](https://github.com/abap2UI5/abap2UI5) and the top-level apps of [samples](https://github.com/abap2UI5/samples), runs downport, transpile, unit tests and the webpack build, then **smoke tests the built site in a real browser** before deploying it to [web-abap2UI5-build](https://github.com/abap2UI5/web-abap2UI5-build) (GitHub Pages). Note: GitHub disables scheduled workflows after 60 days without repository activity — re-enable it under Actions if the demo stops updating.

The browser gate is the one that matters: everything upstream of it can be green while the deployed page is blank, because a bundling or initialization fault only shows when the bundle actually runs. `tests/web.spec.js` loads the freshly built `./build`, waits for the in-browser backend to answer, and asserts an event roundtrip restores the saved draft. Before it existed, the site deployed completely untested.

```
npm run build:web   # build ./build
npm run test:e2e    # the same gate, locally (playwright, project chromium-web)
```

`@abaplint/cli` is pinned to the version used by abap2UI5 itself, since the downport result must pass the same syntax check. Dependabot is told to leave that pin alone — see `.github/dependabot.yml`.

The deploy is a **production** webpack build. Two Terser defaults have to be turned off for it (`keep_classnames`, `keep_fnames`) because the transpiled ABAP carries its type system in the class and function names that RTTI reads back — see the comment in `webpack.config.js`.

The deployed site is not only the bundle: `app/pages/` (README, 404 page) and
this repository's `LICENSE` are copied into `./build` before the deploy, and
the build's provenance is written as `build-stamp.txt` plus a human-readable
`BUILD_INFO.json`. The deploy runs with `force_orphan: true`, so anything
committed in the artifact repository by hand is gone with the next run — every
file that should be there has to be produced here.

### Limitations & Todo
* Samples in subfolders of the samples repository (system samples, launchpad samples) are excluded — they require a real SAP system and cannot be transpiled
* `src/99` of abap2UI5 (the frozen legacy package) is not part of the build. `clone:core` drops it. Should a sample ever need one of those classes again, the fix belongs in the sample — `src/99` is on abap2UI5's removal plan and will not be there forever
* A known upstream [@abaplint/transpiler](https://github.com/abaplint/transpiler) issue makes `check_on_init( )` always false in the transpiled backend (interface attributes read through an interface-typed reference resolve to a missing JS property), so backend-built view XML may not be returned even though the roundtrip succeeds

### Credits
* abaplint, open-abap, express-icf-shim, webpacking by [larshp](https://github.com/larshp)
