/*
 * The transpiler's `skip` list is upstream's, not ours.
 *
 * A handful of abap2UI5 unit tests cannot pass under @abaplint/transpiler,
 * because they cover behaviour the NodeJS runtime does not reproduce - a
 * dynamic `describe_by_name`, microsecond timestamps, or a field-symbol type
 * check the runtime does not enforce. abap2UI5 knows which ones and lists
 * them in `node/setup/abap_transpile.json`, right next to the test it adds.
 *
 * This repository transpiles those same sources, so it needs the same list -
 * and it kept a hand-written SECOND COPY of it. That copy is what broke the
 * nightly on 2026-08-03 (issue #63, `test_tab_ref_gen`) and again on
 * 2026-09-02 (issue #84, `test_skip_sorted_table`): upstream added a test and
 * its skip entry in one commit, the clone here picked up the test and knew
 * nothing about the entry, and a build that was correct in every other
 * respect went red on a test upstream had already declared unrunnable. The
 * second time the skip entry was 57 minutes old.
 *
 * So the list is no longer copied. `clone:core` already puts upstream's
 * checkout in `abap2UI5/`; this reads the skip array out of it and writes the
 * config the transpiler actually runs. Same reasoning as the abaplint
 * downport shim in AGENTS.md: it is upstream's file, run from the clone,
 * never a copy.
 *
 * `ci/abap_transpile.json` stays the checked-in base and keeps everything
 * about THIS pipeline (folders, setup hook, keywords). Its own `skip` array
 * now holds only the entries upstream does not have - a skip that is ours,
 * for a reason that is ours. The two are unioned; upstream wins on a
 * duplicate, so an entry upstream adopts stops being maintained here without
 * anyone having to notice.
 *
 * Missing or unreadable upstream list = hard failure, deliberately. The whole
 * point is that this repository stops guessing what upstream skips: a build
 * that silently fell back to the local half would be the drift again, just
 * quieter. When upstream moves the file, the message below names the path and
 * the fix is one line here.
 */
import fs from "node:fs";

const BASE = "ci/abap_transpile.json";
const UPSTREAM = "abap2UI5/node/setup/abap_transpile.json";
const OUT = "ci/abap_transpile.run.json";

const die = (msg) => {
  console.error(`merge_transpile_skips: ${msg}`);
  process.exit(1);
};

let up;
try {
  up = JSON.parse(fs.readFileSync(UPSTREAM, "utf8"));
} catch (e) {
  die(`cannot read ${UPSTREAM} (${e.code ?? e.message}) - it is the source of the skip list.\n`
    + "  Run `npm run clone` first; if upstream moved or renamed the file, point UPSTREAM here at the new path.");
}

const upSkip = up.options?.skip;
if (!Array.isArray(upSkip)) {
  die(`${UPSTREAM} has no options.skip array - upstream changed the config shape, update this script`);
}

const base = JSON.parse(fs.readFileSync(BASE, "utf8"));
const ownSkip = base.options?.skip ?? [];

// object/class/method identify a skipped test method; the note is prose
const key = (s) => [s.object, s.class, s.method].map((v) => String(v ?? "").toUpperCase()).join("|");
const seen = new Set(upSkip.map(key));
const own = ownSkip.filter((s) => !seen.has(key(s)));
const dropped = ownSkip.length - own.length;

base.options.skip = [...upSkip, ...own];
fs.writeFileSync(OUT, `${JSON.stringify(base, null, 2)}\n`);

console.log(`merge_transpile_skips: ${upSkip.length} skips from abap2UI5 + ${own.length} local`
  + `${dropped ? ` (${dropped} local entr${dropped === 1 ? "y" : "ies"} upstream now carries)` : ""}`
  + ` -> ${OUT}`);
