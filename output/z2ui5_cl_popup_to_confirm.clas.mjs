const {cx_root} = await import("./cx_root.clas.mjs");
// z2ui5_cl_popup_to_confirm.clas.abap
class z2ui5_cl_popup_to_confirm {
  static INTERNAL_TYPE = 'CLAS';
  static INTERNAL_NAME = 'Z2UI5_CL_POPUP_TO_CONFIRM';
  static IMPLEMENTED_INTERFACES = ["Z2UI5_IF_APP","IF_SERIALIZABLE_OBJECT"];
  static ATTRIBUTES = {"CLIENT": {"type": () => {return new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "TITLE": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "ICON": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "QUESTION_TEXT": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "BUTTON_TEXT_CONFIRM": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "BUTTON_TEXT_CANCEL": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "CHECK_INITIALIZED": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "CHECK_RESULT_CONFIRMED": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~ID_DRAFT": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~ID_APP": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~VERSION": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"},
  "Z2UI5_IF_APP~ORIGIN": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"},
  "Z2UI5_IF_APP~LICENSE": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"}};
  static METHODS = {"VIEW_DISPLAY": {"visibility": "O", "parameters": {}},
  "FACTORY": {"visibility": "U", "parameters": {"R_RESULT": {"type": () => {return new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_POPUP_TO_CONFIRM", RTTIName: "\\CLASS=Z2UI5_CL_POPUP_TO_CONFIRM"});}, "is_optional": " "}, "I_QUESTION_TEXT": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "is_optional": " "}, "I_TITLE": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "is_optional": " "}, "I_ICON": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "is_optional": " "}, "I_BUTTON_TEXT_CONFIRM": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "is_optional": " "}, "I_BUTTON_TEXT_CANCEL": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "is_optional": " "}}},
  "RESULT": {"visibility": "U", "parameters": {"RESULT": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "is_optional": " "}}}};
  constructor() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    this.client = new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"});
    this.title = new abap.types.String({qualifiedName: "STRING"});
    this.icon = new abap.types.String({qualifiedName: "STRING"});
    this.question_text = new abap.types.String({qualifiedName: "STRING"});
    this.button_text_confirm = new abap.types.String({qualifiedName: "STRING"});
    this.button_text_cancel = new abap.types.String({qualifiedName: "STRING"});
    this.check_initialized = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    this.check_result_confirmed = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
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
  async result() {
    let result = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    result.set(this.check_result_confirmed);
    return result;
  }
  async factory(INPUT) {
    return z2ui5_cl_popup_to_confirm.factory(INPUT);
  }
  static async factory(INPUT) {
    let r_result = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_POPUP_TO_CONFIRM", RTTIName: "\\CLASS=Z2UI5_CL_POPUP_TO_CONFIRM"});
    let i_question_text = INPUT?.i_question_text;
    if (i_question_text?.getQualifiedName === undefined || i_question_text.getQualifiedName() !== "STRING") { i_question_text = undefined; }
    if (i_question_text === undefined) { i_question_text = new abap.types.String({qualifiedName: "STRING"}).set(INPUT.i_question_text); }
    let i_title = new abap.types.String({qualifiedName: "STRING"});
    if (INPUT && INPUT.i_title) {i_title.set(INPUT.i_title);}
    if (INPUT === undefined || INPUT.i_title === undefined) {i_title = new abap.types.String().set(`Popup To Confirm`);}
    let i_icon = new abap.types.String({qualifiedName: "STRING"});
    if (INPUT && INPUT.i_icon) {i_icon.set(INPUT.i_icon);}
    if (INPUT === undefined || INPUT.i_icon === undefined) {i_icon = new abap.types.Character(24).set('sap-icon://question-mark');}
    let i_button_text_confirm = new abap.types.String({qualifiedName: "STRING"});
    if (INPUT && INPUT.i_button_text_confirm) {i_button_text_confirm.set(INPUT.i_button_text_confirm);}
    if (INPUT === undefined || INPUT.i_button_text_confirm === undefined) {i_button_text_confirm = new abap.types.String().set(`OK`);}
    let i_button_text_cancel = new abap.types.String({qualifiedName: "STRING"});
    if (INPUT && INPUT.i_button_text_cancel) {i_button_text_cancel.set(INPUT.i_button_text_cancel);}
    if (INPUT === undefined || INPUT.i_button_text_cancel === undefined) {i_button_text_cancel = new abap.types.String().set(`Cancel`);}
    r_result.set(await (new abap.Classes['Z2UI5_CL_POPUP_TO_CONFIRM']()).constructor_());
    r_result.get().title.set(i_title);
    r_result.get().icon.set(i_icon);
    r_result.get().question_text.set(i_question_text);
    r_result.get().button_text_confirm.set(i_button_text_confirm);
    r_result.get().button_text_cancel.set(i_button_text_cancel);
    return r_result;
  }
  async view_display() {
    let popup = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    popup.set((await (await (await (await (await (await (await (await (await (await (await (await abap.Classes['Z2UI5_CL_XML_VIEW'].factory_popup()).get().dialog({title: this.title, icon: this.icon, afterclose: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(13).set('BUTTON_CANCEL')}))})).get().content()).get().vbox({class_: new abap.types.Character(17).set('sapUiMediumMargin')})).get().text({text: this.question_text})).get().get_parent()).get().get_parent()).get().footer()).get().overflow_toolbar()).get().toolbar_spacer()).get().button({text: this.button_text_cancel, press: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(13).set('BUTTON_CANCEL')}))})).get().button({text: this.button_text_confirm, press: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(14).set('BUTTON_CONFIRM')})), type: new abap.types.Character(10).set('Emphasized')})));
    await this.client.get().z2ui5_if_client$popup_display({val: (await popup.get().stringify())});
  }
  async z2ui5_if_app$main(INPUT) {
    let client = INPUT?.client;
    if (client?.getQualifiedName === undefined || client.getQualifiedName() !== "Z2UI5_IF_CLIENT") { client = undefined; }
    if (client === undefined) { client = new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"}).set(INPUT.client); }
    this.me.get().client.set(client);
    if (abap.compare.eq(this.check_initialized, abap.builtin.abap_false)) {
      this.check_initialized.set(abap.builtin.abap_true);
      await this.view_display();
      return;
    }
    let unique189 = ((await client.get().z2ui5_if_client$get())).get().event;
    if (abap.compare.eq(unique189, new abap.types.String().set(`BUTTON_CONFIRM`))) {
      this.check_result_confirmed.set(abap.builtin.abap_true);
      await client.get().z2ui5_if_client$popup_destroy();
      await client.get().z2ui5_if_client$nav_app_leave({app: (await client.get().z2ui5_if_client$get_app({id: ((await client.get().z2ui5_if_client$get())).get().s_draft.get().id_prev_app_stack}))});
    } else if (abap.compare.eq(unique189, new abap.types.String().set(`BUTTON_CANCEL`))) {
      this.check_result_confirmed.set(abap.builtin.abap_false);
      await client.get().z2ui5_if_client$popup_destroy();
      await client.get().z2ui5_if_client$nav_app_leave({app: (await client.get().z2ui5_if_client$get_app({id: ((await client.get().z2ui5_if_client$get())).get().s_draft.get().id_prev_app_stack}))});
    }
  }
}
abap.Classes['Z2UI5_CL_POPUP_TO_CONFIRM'] = z2ui5_cl_popup_to_confirm;
z2ui5_cl_popup_to_confirm.z2ui5_if_app$version = new abap.types.String({qualifiedName: "STRING"});
z2ui5_cl_popup_to_confirm.z2ui5_if_app$version.set('1.120.0');
z2ui5_cl_popup_to_confirm.z2ui5_if_app$origin = new abap.types.String({qualifiedName: "STRING"});
z2ui5_cl_popup_to_confirm.z2ui5_if_app$origin.set('https://github.com/abap2UI5/abap2UI5');
z2ui5_cl_popup_to_confirm.z2ui5_if_app$license = new abap.types.String({qualifiedName: "STRING"});
z2ui5_cl_popup_to_confirm.z2ui5_if_app$license.set('MIT');
export {z2ui5_cl_popup_to_confirm};
//# sourceMappingURL=z2ui5_cl_popup_to_confirm.clas.mjs.map