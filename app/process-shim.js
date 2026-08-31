// The `process` the bundle provides, plus the one property the ABAP runtime
// needs and the browser polyfill does not have.
//
// An ABAP `WRITE` reaches @abaplint/runtime's StandardOutConsole, which writes
// to `process.stdout`. The `process/browser` polyfill has no stdout at all, so
// that call is a TypeError - "Cannot read properties of undefined (reading
// 'write')" - thrown out of a `class_constructor` during initialization, which
// aborts the boot before the frontend is ever fetched.
//
// It is not hypothetical and it is not new: it is simply unreachable in an
// unminified build, because the WRITE that triggers it sits behind a branch
// webpack's development build never takes. Minification made it reachable, so
// the shim goes in with it.
//
// console.log rather than a no-op: an ABAP WRITE is somebody debugging, and
// silently dropping the output would be worse than the crash it replaces. The
// trailing newline goes because console.log adds its own.
const process = require("process/browser");

if (!process.stdout) {
  process.stdout = { write: (chunk) => console.log(String(chunk).replace(/\n$/, "")) };
}
if (!process.stderr) {
  process.stderr = { write: (chunk) => console.warn(String(chunk).replace(/\n$/, "")) };
}

module.exports = process;
