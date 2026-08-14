// Pre-downport patch: stop DISSOLVE from walking into the framework core.
//
// Runs against the freshly copied ./downport sources (before abaplint --fix,
// so the anchors below match the upstream code verbatim).
//
// Why: Z2UI5_CL_UI5_SRV_MODEL->DISS_OREF resolves object attribute chains
// dynamically (ASSIGN ('MO_APP->CLIENT->...')). On a real ABAP server the
// traversal never reaches the framework internals, but the open-abap
// transpiler runtime resolves every step through the object's *dynamic*
// type, so dissolve() descends from the app's CLIENT attribute into
// client -> action -> core app -> MT_ATTRI. MAIN_ATTRI_DB_SAVE_SRTTI then
// treats the core app's own attribute-metadata table as an app data
// reference: it stores its SRTTI, CLEARs the table and unbinds the
// reference while saving the draft. The persisted draft ends up with
// <MT_ATTRI/> (no metadata at all) and every follow-up request that
// restores it dies with "LOOP at undefined" - on the GitHub Pages demo the
// first button press (e.g. BUTTON_CHECK on the startup app) shows
// "Network error: LOOP at undefined".
//
// The guard below skips dissolving into any framework core instance,
// mirroring the real-server behavior. Written in v702-compatible ABAP so
// the downport step does not need to rewrite it.
//
// abap2UI5#2564 renamed the whole core layer z2ui5_cl_core_* -> z2ui5_cl_ui5_*
// (and the context helper to z2ui5_cl_ui5_util_context). Both spellings are
// accepted here and in the anchor below, the way the earlier context rename
// already is - a patch that only knows one name breaks the daily build the
// day upstream renames, which is exactly what happened on 2026-08-12.
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("../downport", import.meta.url).pathname;
const TARGETS = ["z2ui5_cl_ui5_srv_model.clas.abap", "z2ui5_cl_core_srv_model.clas.abap"];

function find(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      const hit = find(path);
      if (hit) return hit;
    } else if (TARGETS.includes(entry)) {
      return path;
    }
  }
  return undefined;
}

const file = find(ROOT);
if (!file) {
  throw new Error(`patch_diss_oref: none of ${TARGETS.join(" / ")} found under ${ROOT}`);
}

let src = readFileSync(file, "utf8");

// Upstream renamed Z2UI5_CL_ABAP2UI5_CONTEXT to Z2UI5_CL_A2UI5_CONTEXT
// (2026-07), then the whole core layer to z2ui5_cl_ui5_* (#2564, 2026-08);
// accept every spelling so the patch survives any of those states.
const anchorRe = /^( *)DATA\(lr_ref\) = z2ui5_cl_(?:abap2ui5|a2ui5|ui5_util)_context=>unassign_object\( lr_val \)\.$/m;
const guard = `
    " Patch for the transpiled all-in-browser build (ci/patch_diss_oref.mjs):
    " never dissolve into abap2UI5 framework objects. The open-abap runtime
    " resolves dynamic attribute chains through the dynamic type, so without
    " this guard dissolve() walks client -> action -> core app and
    " main_attri_db_save_srtti clears the core app's MT_ATTRI while saving
    " the draft ("LOOP at undefined" on the next request).
    " The renamed core set is named class by class, NOT as Z2UI5_CL_UI5_*:
    " that prefix also carries the demo APPS (z2ui5_cl_ui5_app_start,
    " z2ui5_cl_ui5_app_hi_world) and the released API, and guarding an app
    " stops its own attributes from being dissolved - the startup page then
    " dies in main_attri_search on its first _bind( ).
    DATA lo_diss_guard TYPE REF TO cl_abap_typedescr.
    lo_diss_guard = cl_abap_typedescr=>describe_by_object_ref( lr_ref ).
    IF lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_CORE_*'
       OR lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_UI5_SRV_*'
       OR lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_UI5_ACTION'
       OR lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_UI5_APP_CONT'
       OR lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_UI5_CLIENT'
       OR lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_UI5_FRONTEND'
       OR lo_diss_guard->absolute_name CP '\\CLASS=Z2UI5_CL_UI5_HANDLER'.
      RETURN.
    ENDIF.
`;

const methodStart = src.indexOf("METHOD diss_oref.");
const methodEnd = src.indexOf("ENDMETHOD.", methodStart);
if (methodStart === -1 || methodEnd === -1) {
  throw new Error("patch_diss_oref: METHOD diss_oref not found - upstream source changed?");
}
const method = src.slice(methodStart, methodEnd);
if (!anchorRe.test(method)) {
  throw new Error("patch_diss_oref: anchor line not found in diss_oref - upstream source changed?");
}

const patched = method.replace(anchorRe, (line) => line + "\n" + guard);
src = src.slice(0, methodStart) + patched + src.slice(methodEnd);

writeFileSync(file, src);
console.log(`patch_diss_oref: guarded diss_oref in ${file}`);
