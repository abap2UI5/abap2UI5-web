/*
 * The exact @abaplint/cli pin here must stay in lockstep with the version
 * abap2UI5 itself syntax-checks with (AGENTS.md "Pins") - the downport result
 * has to pass the same check as upstream's source. That rule was prose only,
 * and the pin sat at 2.120.3 while upstream had long moved on to 2.120.33.
 *
 * Runs after clone:core, so the fresh abap2UI5/ checkout is the reference:
 * the pin must satisfy upstream's declared range AND not be older than what
 * upstream's lockfile actually resolves. Satisfying the range keeps this
 * green across upstream's routine lockfile bumps; the lockfile floor is what
 * catches a pin left behind for months.
 */
import fs from "node:fs";

const own = JSON.parse(fs.readFileSync("package.json", "utf8"));
const pin = own.devDependencies["@abaplint/cli"];
if (!/^\d+\.\d+\.\d+$/.test(pin)) {
  console.error(`check-abaplint-pin: the pin must be exact (no caret), found "${pin}"`);
  process.exit(1);
}

const up = JSON.parse(fs.readFileSync("abap2UI5/package.json", "utf8"));
const range = (up.devDependencies || {})["@abaplint/cli"] || "";
const lock = JSON.parse(fs.readFileSync("abap2UI5/package-lock.json", "utf8"));
const locked = lock.packages?.["node_modules/@abaplint/cli"]?.version;

const parse = (v) => v.replace(/^[^\d]*/, "").split(".").map(Number);
const cmp = (a, b) => {
  const [x, y] = [parse(a), parse(b)];
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};

// caret range: same major, at least the stated version - the only shape
// upstream has ever used for this dependency
const m = range.match(/^\^(\d+)\.(\d+\.\d+)$/);
if (!m) {
  console.error(`check-abaplint-pin: upstream range "${range}" is not the ^x.y.z shape this check knows - update ci/check-abaplint-pin.mjs`);
  process.exit(1);
}
const problems = [];
if (parse(pin)[0] !== Number(m[1]) || cmp(pin, `${m[1]}.${m[2]}`) < 0) {
  problems.push(`pin ${pin} does not satisfy abap2UI5's range ${range}`);
}
if (locked && cmp(pin, locked) < 0) {
  problems.push(`pin ${pin} is older than the ${locked} abap2UI5's lockfile resolves`);
}
if (problems.length) {
  for (const p of problems) console.error(`check-abaplint-pin: ${p}`);
  console.error("check-abaplint-pin: bump @abaplint/cli here together with abap2UI5's pin (AGENTS.md \"Pins\")");
  process.exit(1);
}
console.log(`check-abaplint-pin: ${pin} is in lockstep with abap2UI5 (range ${range}, lock ${locked ?? "n/a"})`);
