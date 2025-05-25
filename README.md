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
[https://abap2ui5.github.io/web-abap2ui5-samples/](https://abap2ui5.github.io/web-abap2ui5-samples/)

### Limitations & Todo
* Frontend files are outdated, update Webpacked frontend

### Credits
* abaplint, open-abap, express-icf-shim, webpacking by [larshp](https://github.com/larshp)
