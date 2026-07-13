/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = ({mode} = {mode: "development"}) => ({
  entry: {
    "app": "./app/web.mjs",
  },
  mode,
  devtool: "nosources-source-map",
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
        { from: './node_modules/sql.js/dist/sql-wasm.wasm', to: "./" },
        { from: './node_modules/sql.js/dist/sql-wasm-debug.wasm', to: "./" },
        { from: './node_modules/sql.js/dist/sql-wasm-debug.js', to: "./" },
        // sql.js >= 1.13 ships a dedicated browser build; the browser entry
        // of @abaplint/database-sqlite fetches sql-wasm-browser.wasm.
        { from: './node_modules/sql.js/dist/sql-wasm-browser.wasm', to: "./" },
        { from: './node_modules/sql.js/dist/sql-wasm-browser-debug.wasm', to: "./" },
        // The z2ui5 frontend manifest includes css/style.css; without the
        // file every boot of the GitHub Pages demo logs a 404.
        { from: './app/css/style.css', to: "./css/style.css" },
      ],
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
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
