/*
 * The downport RULE SET is upstream's, not ours.
 *
 * `build:downport` runs abaplint's `downport` rule over a copy of upstream's
 * sources to produce 7.02-compatible ABAP. Which rules run alongside it, and
 * which syntax version they judge against, is a fact about abap2UI5: the
 * downport result here has to pass the same check as upstream's own source.
 * That is the same rule AGENTS.md states for the `@abaplint/cli` pin, and
 * `ci/check-abaplint-pin.mjs` already enforces the version half of it.
 *
 * The rules half was a hand-written copy of upstream's
 * `.github/abaplint/abap_702.jsonc`, and it had already drifted: upstream
 * runs `xml_bom`, this copy did not, and nothing anywhere would have said so.
 * That is the shape of failure this pipeline keeps paying for - see the
 * transpiler skip list next to it in AGENTS.md, where the same silent copy
 * cost issue #63 and issue #84.
 *
 * So the rules and the syntax version are read from the clone `clone:core`
 * already makes. `ci/abaplint-downport.jsonc` stays the checked-in base and
 * keeps what is genuinely THIS pipeline's: `global.files` and the dependency
 * folder, whose paths are relative to `ci/` and have nothing to do with
 * upstream's layout. Its `rules` object holds only local OVERRIDES - a rule
 * this repository must switch off or configure differently for a reason of
 * its own. It is empty today, and empty is the correct state.
 *
 * Upstream moving off 7.02, or renaming the file, fails the build here with
 * the path in the message. Deliberately: a silent fall back to the last
 * copied rule set is how the copy stopped matching in the first place.
 */
import fs from "node:fs";

const BASE = "ci/abaplint-downport.jsonc";
const UPSTREAM = "abap2UI5/.github/abaplint/abap_702.jsonc";
const OUT = "ci/abaplint-downport.run.jsonc";

const die = (msg) => {
  console.error(`merge_downport_config: ${msg}`);
  process.exit(1);
};

/* abaplint reads .jsonc, so a comment may appear in either file any day. A
 * naive comment strip eats the `//` of the open-abap dependency URL, so this
 * tracks string state instead of pattern-matching. */
function parseJsonc(text, where) {
  let out = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      out += c;
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === '"') inString = false;
      continue;
    }
    if (c === '"') {
      inString = true;
      out += c;
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      while (i < text.length && text[i] !== "\n") i++;
      out += "\n";
      continue;
    }
    if (c === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? text.length : end + 1;
      continue;
    }
    out += c;
  }
  try {
    return JSON.parse(out);
  } catch (e) {
    die(`${where} is not valid JSON/JSONC: ${e.message}`);
  }
}

const readOr = (file, what) => {
  try {
    return fs.readFileSync(file, "utf8");
  } catch (e) {
    die(`cannot read ${file} (${e.code ?? e.message}) - it is the source of ${what}.\n`
      + "  Run `npm run clone` first; if upstream moved or renamed the file, point UPSTREAM here at the new path.");
  }
};

const up = parseJsonc(readOr(UPSTREAM, "the downport rule set"), UPSTREAM);
if (!up.rules || typeof up.rules !== "object") die(`${UPSTREAM} has no rules object - upstream changed the config shape, update this script`);
if (!up.syntax) die(`${UPSTREAM} has no syntax block - upstream changed the config shape, update this script`);

const base = parseJsonc(fs.readFileSync(BASE, "utf8"), BASE);
if (!base.global?.files) die(`${BASE} must keep global.files - it is this pipeline's path, not upstream's`);
if (!base.dependencies) die(`${BASE} must keep dependencies - the folder is this pipeline's, not upstream's`);

const overrides = base.rules ?? {};
const run = {
  global: base.global,
  dependencies: base.dependencies,
  syntax: up.syntax,
  rules: { ...up.rules, ...overrides },
};
fs.writeFileSync(OUT, `${JSON.stringify(run, null, 2)}\n`);

const names = Object.keys(overrides);
console.log(`merge_downport_config: ${Object.keys(up.rules).length} rules from abap2UI5 (syntax ${up.syntax.version})`
  + `${names.length ? `, ${names.length} local override(s): ${names.join(", ")}` : ""}`
  + ` -> ${OUT}`);
