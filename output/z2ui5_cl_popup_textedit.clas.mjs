const {cx_root} = await import("./cx_root.clas.mjs");
// z2ui5_cl_popup_textedit.clas.abap
class z2ui5_cl_popup_textedit {
  static INTERNAL_TYPE = 'CLAS';
  static INTERNAL_NAME = 'Z2UI5_CL_POPUP_TEXTEDIT';
  static IMPLEMENTED_INTERFACES = ["Z2UI5_IF_APP","IF_SERIALIZABLE_OBJECT"];
  static ATTRIBUTES = {"CLIENT": {"type": () => {return new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "MV_STRETCH_ACTIVE": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "CHECK_INITIALIZED": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "MS_RESULT": {"type": () => {return new abap.types.Structure({"text": new abap.types.String({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT=>TY_S_RESULT-TEXT"}), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_textedit=>ty_s_result", undefined, {}, {});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~ID_DRAFT": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~ID_APP": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~VERSION": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"},
  "Z2UI5_IF_APP~ORIGIN": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"},
  "Z2UI5_IF_APP~LICENSE": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"}};
  static METHODS = {"FACTORY": {"visibility": "U", "parameters": {"R_RESULT": {"type": () => {return new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT", RTTIName: "\\CLASS=Z2UI5_CL_POPUP_TEXTEDIT"});}, "is_optional": " "}, "I_STRETCH_ACTIVE": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "is_optional": " "}, "I_TEXTAREA": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "is_optional": " "}}},
  "DISPLAY": {"visibility": "U", "parameters": {}},
  "RESULT": {"visibility": "U", "parameters": {"RESULT": {"type": () => {return new abap.types.Structure({"text": new abap.types.String({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT=>TY_S_RESULT-TEXT"}), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_textedit=>ty_s_result", undefined, {}, {});}, "is_optional": " "}}}};
  constructor() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    this.client = new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"});
    this.mv_stretch_active = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    this.check_initialized = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    this.ms_result = new abap.types.Structure({"text": new abap.types.String({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT=>TY_S_RESULT-TEXT"}), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_textedit=>ty_s_result", undefined, {}, {});
    this.z2ui5_if_app$version = abap.Classes['Z2UI5_IF_APP'].z2ui5_if_app$version;
    this.z2ui5_if_app$origin = abap.Classes['Z2UI5_IF_APP'].z2ui5_if_app$origin;
    this.z2ui5_if_app$license = abap.Classes['Z2UI5_IF_APP'].z2ui5_if_app$license;
    if (this.z2ui5_if_app$id_draft === undefined) this.z2ui5_if_app$id_draft = new abap.types.String({qualifiedName: "STRING"});
    if (this.z2ui5_if_app$id_app === undefined) this.z2ui5_if_app$id_app = new abap.types.String({qualifiedName: "STRING"});
  }
  async constructor_(INPUT) {
    if (super.constructor_) { await super.constructor_(INPUT); }
    return this;
  }
  async factory(INPUT) {
    return z2ui5_cl_popup_textedit.factory(INPUT);
  }
  static async factory(INPUT) {
    let r_result = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT", RTTIName: "\\CLASS=Z2UI5_CL_POPUP_TEXTEDIT"});
    let i_stretch_active = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    if (INPUT && INPUT.i_stretch_active) {i_stretch_active.set(INPUT.i_stretch_active);}
    if (INPUT === undefined || INPUT.i_stretch_active === undefined) {i_stretch_active = abap.builtin.abap_true;}
    let i_textarea = new abap.types.String({qualifiedName: "STRING"});
    if (INPUT && INPUT.i_textarea) {i_textarea.set(INPUT.i_textarea);}
    r_result.set(await (new abap.Classes['Z2UI5_CL_POPUP_TEXTEDIT']()).constructor_());
    r_result.get().mv_stretch_active.set(i_stretch_active);
    r_result.get().ms_result.get().text.set(i_textarea);
    return r_result;
  }
  async display() {
    let popup = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    popup.set((await (await (await (await (await (await (await (await (await (await abap.Classes['Z2UI5_CL_XML_VIEW'].factory_popup()).get().dialog({afterclose: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(22).set('BUTTON_TEXTAREA_CANCEL')})), stretch: this.mv_stretch_active, title: new abap.types.Character(5).set('Title'), icon: new abap.types.Character(15).set('sap-icon://edit')})).get().content()).get().text_area({width: new abap.types.Character(4).set('100%'), value: (await this.client.get().z2ui5_if_client$_bind_edit({val: this.ms_result.get().text}))})).get().get_parent()).get().footer()).get().overflow_toolbar()).get().toolbar_spacer()).get().button({text: new abap.types.Character(6).set('Cancel'), press: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(22).set('BUTTON_TEXTAREA_CANCEL')}))})).get().button({text: new abap.types.Character(7).set('Confirm'), press: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(23).set('BUTTON_TEXTAREA_CONFIRM')})), type: new abap.types.Character(10).set('Emphasized')})));
    await this.client.get().z2ui5_if_client$popup_display({val: (await popup.get().stringify())});
  }
  async z2ui5_if_app$main(INPUT) {
    let client = INPUT?.client;
    if (client?.getQualifiedName === undefined || client.getQualifiedName() !== "Z2UI5_IF_CLIENT") { client = undefined; }
    if (client === undefined) { client = new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"}).set(INPUT.client); }
    this.me.get().client.set(client);
    if (abap.compare.eq(this.check_initialized, abap.builtin.abap_false)) {
      this.check_initialized.set(abap.builtin.abap_true);
      await this.display();
      return;
    }
    let unique182 = ((await client.get().z2ui5_if_client$get())).get().event;
    if (abap.compare.eq(unique182, new abap.types.String().set(`BUTTON_TEXTAREA_CONFIRM`))) {
      this.ms_result.get().check_confirmed.set(abap.builtin.abap_true);
      await client.get().z2ui5_if_client$popup_destroy();
      await client.get().z2ui5_if_client$nav_app_leave({app: (await client.get().z2ui5_if_client$get_app({id: ((await client.get().z2ui5_if_client$get())).get().s_draft.get().id_prev_app_stack}))});
    } else if (abap.compare.eq(unique182, new abap.types.String().set(`BUTTON_TEXTAREA_CANCEL`))) {
      await client.get().z2ui5_if_client$popup_destroy();
      await client.get().z2ui5_if_client$nav_app_leave({app: (await client.get().z2ui5_if_client$get_app({id: ((await client.get().z2ui5_if_client$get())).get().s_draft.get().id_prev_app_stack}))});
    }
  }
  async result() {
    let result = new abap.types.Structure({"text": new abap.types.String({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT=>TY_S_RESULT-TEXT"}), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_textedit=>ty_s_result", undefined, {}, {});
    result.set(this.ms_result);
    return result;
  }
}
abap.Classes['Z2UI5_CL_POPUP_TEXTEDIT'] = z2ui5_cl_popup_textedit;
z2ui5_cl_popup_textedit.z2ui5_if_app$version = new abap.types.String({qualifiedName: "STRING"});
z2ui5_cl_popup_textedit.z2ui5_if_app$version.set('1.120.0');
z2ui5_cl_popup_textedit.z2ui5_if_app$origin = new abap.types.String({qualifiedName: "STRING"});
z2ui5_cl_popup_textedit.z2ui5_if_app$origin.set('https://github.com/abap2UI5/abap2UI5');
z2ui5_cl_popup_textedit.z2ui5_if_app$license = new abap.types.String({qualifiedName: "STRING"});
z2ui5_cl_popup_textedit.z2ui5_if_app$license.set('MIT');
z2ui5_cl_popup_textedit.ty_s_result = new abap.types.Structure({"text": new abap.types.String({qualifiedName: "Z2UI5_CL_POPUP_TEXTEDIT=>TY_S_RESULT-TEXT"}), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_textedit=>ty_s_result", undefined, {}, {});
export {z2ui5_cl_popup_textedit};
//# sourceMappingURL=z2ui5_cl_popup_textedit.clas.mjs.map