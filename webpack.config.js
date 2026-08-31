/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");

module.exports = (env = {}) => ({
  entry: {
    "app": "./app/web.mjs",
  },
  // No `mode` here: the --mode flag on the command line is the single place
  // it is decided (production for the deploy, development for the dev
  // server). This used to read `mode: env.mode` behind a default of
  // "development" that could never apply - webpack-cli always passes an env
  // object, so env.mode was always undefined and only the flag ever counted.
  // The source map alone adds ~2 MB to every GitHub Pages deploy, so it is
  // opt-in for builds (WEB_SOURCEMAP=1) and always on for the dev server.
  devtool: env.WEBPACK_SERVE || process.env.WEB_SOURCEMAP
    ? "nosources-source-map"
    : false,
  experiments: {
    topLevelAwait: true
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].bundle.js",
    globalObject: "self",
    clean: true,
  },
  devServer: {
    open: true,
    hot: true,
  },
  resolve: {
    fallback: {
      "./%23ui2%23cl_json.clas.mjs": false,
      "crypto": false,
      "path": require.resolve("path-browserify"),
      "buffer": require.resolve("buffer/"),
      "util/types": false,
      "util": require.resolve("web-encoding"),
      "zlib": false,
      "stream": false,
      "process": false,
      "http": false,
      "url": false,
      "fs": false,
      "tls": false,
      "https": false,
      "vm": false,
      "net": false,
    },
    extensions: [".mjs", ".js"],
  },
  optimization: {
    minimizer: [
      // Both options are load-bearing, and neither is a precaution.
      //
      // The transpiled ABAP carries its type system into JavaScript by NAME:
      // `describe_by_data` and the rest of RTTI read the class and function
      // names off the generated objects to answer what an ABAP variable's type
      // is. Terser's default mangling renames those, RTTI then derives a type
      // from `a` or `s`, and the failure surfaces far away from the cause as a
      // CONVT_NO_NUMBER thrown out of a class_constructor during boot - a
      // blank page with one unhelpful line in the console.
      //
      // So this is not "minification is unsafe here". It is that exactly two
      // Terser defaults are incompatible with a runtime that reflects on its
      // own identifiers, and naming them costs about 150 KB of the 2.9 MB the
      // minifier saves.
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
  },
  module: {
    rules: [
    ],
    parser: {
      javascript: {
        // Bundle the sequential await import() calls of output/init.mjs
        // eagerly into the main bundle instead of emitting one async chunk
        // per transpiled class, while keeping their evaluation order.
        dynamicImportMode: "eager",
      },
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "app/index.html",
      scriptLoading: "blocking",
    }),
    new CopyPlugin({
      patterns: [
        // sql.js >= 1.13 ships a dedicated browser build, and the browser
        // entry of @abaplint/database-sqlite fetches sql-wasm-browser.wasm.
        // That is the only wasm the bundle asks for. sql-wasm.wasm - the
        // Node-side variant, byte-identical and 658 KB - was copied here too
        // and nothing ever fetched it: the one mention of that name in the
        // bundle is inside a source comment, preserved because the build was
        // unminified. The -debug variants of both (~740 KB each) were already
        // left out for the same reason.
        { from: './node_modules/sql.js/dist/sql-wasm-browser.wasm', to: "./" },
        // The z2ui5 frontend manifest includes css/style.css; without the
        // file every boot of the GitHub Pages demo logs a 404.
        { from: './app/css/style.css', to: "./css/style.css" },
      ],
    }),
    new webpack.ProvidePlugin({
      // Not `process/browser` directly - see app/process-shim.js, which adds
      // the `stdout` an ABAP WRITE needs and the polyfill does not have.
      process: path.resolve(__dirname, "app/process-shim.js"),
      Buffer: ['buffer', 'Buffer'],
    }),
    // The transpiled output loads every module via top-level `await import()`
    // (see ci/patch_init_order.mjs), which webpack would otherwise split into
    // one tiny async chunk per ABAP object — 1700+ files and ~1000 requests
    // on GitHub Pages. Merging everything into a single chunk keeps the
    // deterministic initialization order but ships one bundle.
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
  ],
});
