// Post-transpile patch: serialize module initialization in output/_init.mjs.
//
// The transpiler emits one static `import "./<module>.mjs";` per object. All
// of these modules use top-level await, which makes them async modules: the
// ECMAScript spec only guarantees that async sibling modules *start* in
// order, not that each one *finishes* before the next one starts. Cross-class
// references made during class_constructor execution (e.g. Z2UI5_CL_UTIL
// reading CL_ABAP_OBJECTDESCR=>PUBLIC) go through the abap.Classes registry
// and are invisible to the module graph, so they rely on sibling completion
// order. Node's scheduler happens to evaluate the modules in a working
// order, but webpack's async-module runtime does not — in the browser bundle
// Z2UI5_CL_UTIL's class_constructor runs before CL_ABAP_OBJECTDESCR is
// registered, which crashes the GitHub page with
// "Cannot read properties of undefined (reading 'public')".
//
// Rewriting the static imports into sequential top-level `await import(...)`
// calls forces each module (including all of its own top-level awaits) to
// finish evaluating before the next one starts, in the dependency order the
// transpiler already emits. This makes the initialization order deterministic
// in every ESM runtime and bundler.
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../output/_init.mjs", import.meta.url);
let src = readFileSync(file, "utf8");

const before = src;
src = src.replace(/^import ("\.\/[^"]+");$/gm, "await import($1);");

if (src === before) {
  throw new Error("patch_init_order: no static imports found in output/_init.mjs — transpiler output format changed?");
}

writeFileSync(file, src);
console.log("patch_init_order: serialized module initialization in output/_init.mjs");
