const {z2ui5_cl_core_app_startup} = await import("./z2ui5_cl_core_app_startup.clas.mjs");
const {cx_root} = await import("./cx_root.clas.mjs");
// z2ui5_cl_core_app_startup.clas.testclasses.abap
class ltcl_app_startup_test {
  static INTERNAL_TYPE = 'CLAS';
  static INTERNAL_NAME = 'CLAS-Z2UI5_CL_CORE_APP_STARTUP-LTCL_APP_STARTUP_TEST';
  static IMPLEMENTED_INTERFACES = [];
  static ATTRIBUTES = {};
  static METHODS = {"FIRST_TEST": {"visibility": "I", "parameters": {}}};
  constructor() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
  }
  async constructor_(INPUT) {
    if (super.constructor_) { await super.constructor_(INPUT); }
    return this;
  }
  async first_test() {
    let lo_app = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_CORE_APP_STARTUP", RTTIName: "\\CLASS=Z2UI5_CL_CORE_APP_STARTUP"});
    lo_app.set((await abap.Classes['Z2UI5_CL_CORE_APP_STARTUP'].factory()));
  }
}
abap.Classes['CLAS-Z2UI5_CL_CORE_APP_STARTUP-LTCL_APP_STARTUP_TEST'] = ltcl_app_startup_test;
export {ltcl_app_startup_test};
//# sourceMappingURL=z2ui5_cl_core_app_startup.clas.testclasses.mjs.map