## abap2UI5-web

### Functionality
* Downporting with [abaplint](https://abaplint.org/)
* Transpiling to JS with [abaplint/transpiler](https://github.com/abaplint/transpiler)
* Running on Node.js with [open-abap](https://github.com/open-abap/express-icf-shim)
* Service exposing via [express-icf-shim](https://github.com/open-abap/express-icf-shim)

### Tasks
##### Downport & Transpile
```
npm run init
npm run build
```
##### Run Unit Tests
```
npm run unit
```
##### Run Webservice
```
npm run express
```

##### Webpack Build Strategy

1. Clone repositories into /src/
2. Downport /src/ into /downport/
3. Transpile with express-icf-shim into /output/
4. Webpack backend + frontend + database into folder build

```
npm run webpack:build
```

### Demo
Backend Running in Browser
[https://abap2ui5.github.io/web-abap2UI5-build/](https://abap2ui5.github.io/web-abap2UI5-build/)

### CI
The `build_web` workflow runs daily: it clones [abap2UI5](https://github.com/abap2UI5/abap2UI5) and the top-level apps of [samples](https://github.com/abap2UI5/samples), runs downport, transpile, unit tests and the webpack build, and deploys the result to [web-abap2UI5-build](https://github.com/abap2UI5/web-abap2UI5-build) (GitHub Pages). Note: GitHub disables scheduled workflows after 60 days without repository activity — re-enable it under Actions if the demo stops updating.

`@abaplint/cli` is pinned to the version used by abap2UI5 itself, since the downport result must pass the same syntax check.

### Limitations & Todo
* Frontend files are outdated, update Webpacked frontend
* Samples in subfolders of the samples repository (system samples, launchpad samples) are excluded — they require a real SAP system and cannot be transpiled

### Credits
* abaplint, open-abap, express-icf-shim, webpacking by [larshp](https://github.com/larshp)
