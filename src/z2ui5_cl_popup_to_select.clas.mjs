const {cx_root} = await import("./cx_root.clas.mjs");
// z2ui5_cl_popup_to_select.clas.abap
class z2ui5_cl_popup_to_select {
  static INTERNAL_TYPE = 'CLAS';
  static INTERNAL_NAME = 'Z2UI5_CL_POPUP_TO_SELECT';
  static IMPLEMENTED_INTERFACES = ["Z2UI5_IF_APP","IF_SERIALIZABLE_OBJECT"];
  static ATTRIBUTES = {"MS_RESULT": {"type": () => {return new abap.types.Structure({"row": new abap.types.DataReference(new abap.types.Character(4)), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_to_select=>ty_s_result", undefined, {}, {});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "MR_TAB": {"type": () => {return new abap.types.DataReference(new abap.types.Character(4));}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "MR_TAB_POPUP": {"type": () => {return new abap.types.DataReference(new abap.types.Character(4));}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "MR_TAB_POPUP_BACKUP": {"type": () => {return new abap.types.DataReference(new abap.types.Character(4));}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "CHECK_INITIALIZED": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "CHECK_TABLE_LINE": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "CLIENT": {"type": () => {return new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "TITLE": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "SORT_FIELD": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "DESCENDING": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "visibility": "O", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~ID_DRAFT": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~ID_APP": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": " ", "is_class": " "},
  "Z2UI5_IF_APP~VERSION": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"},
  "Z2UI5_IF_APP~ORIGIN": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"},
  "Z2UI5_IF_APP~LICENSE": {"type": () => {return new abap.types.String({qualifiedName: "STRING"});}, "visibility": "U", "is_constant": "X", "is_class": "X"}};
  static METHODS = {"ON_EVENT": {"visibility": "O", "parameters": {}},
  "DISPLAY": {"visibility": "O", "parameters": {}},
  "SET_OUTPUT_TABLE": {"visibility": "O", "parameters": {}},
  "ON_EVENT_CONFIRM": {"visibility": "O", "parameters": {}},
  "ON_EVENT_SEARCH": {"visibility": "O", "parameters": {}},
  "FACTORY": {"visibility": "U", "parameters": {"R_RESULT": {"type": () => {return new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_POPUP_TO_SELECT", RTTIName: "\\CLASS=Z2UI5_CL_POPUP_TO_SELECT"});}, "is_optional": " "}, "I_TAB": {"type": () => {return abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"});}, "is_optional": " "}, "I_TITLE": {"type": () => {return new abap.types.Character();}, "is_optional": " "}, "I_SORT_FIELD": {"type": () => {return new abap.types.Character();}, "is_optional": " "}, "I_DESCENDING": {"type": () => {return new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});}, "is_optional": " "}}},
  "RESULT": {"visibility": "U", "parameters": {"RESULT": {"type": () => {return new abap.types.Structure({"row": new abap.types.DataReference(new abap.types.Character(4)), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_to_select=>ty_s_result", undefined, {}, {});}, "is_optional": " "}}}};
  constructor() {
    this.me = new abap.types.ABAPObject();
    this.me.set(this);
    this.ms_result = new abap.types.Structure({"row": new abap.types.DataReference(new abap.types.Character(4)), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_to_select=>ty_s_result", undefined, {}, {});
    this.mr_tab = new abap.types.DataReference(new abap.types.Character(4));
    this.mr_tab_popup = new abap.types.DataReference(new abap.types.Character(4));
    this.mr_tab_popup_backup = new abap.types.DataReference(new abap.types.Character(4));
    this.check_initialized = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    this.check_table_line = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    this.client = new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"});
    this.title = new abap.types.String({qualifiedName: "STRING"});
    this.sort_field = new abap.types.String({qualifiedName: "STRING"});
    this.descending = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
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
    return z2ui5_cl_popup_to_select.factory(INPUT);
  }
  static async factory(INPUT) {
    let r_result = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_POPUP_TO_SELECT", RTTIName: "\\CLASS=Z2UI5_CL_POPUP_TO_SELECT"});
    let i_tab = INPUT?.i_tab;
    let i_title = INPUT?.i_title || new abap.types.Character();
    let i_sort_field = INPUT?.i_sort_field || new abap.types.Character();
    let i_descending = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
    if (INPUT && INPUT.i_descending) {i_descending.set(INPUT.i_descending);}
    r_result.set(await (new abap.Classes['Z2UI5_CL_POPUP_TO_SELECT']()).constructor_());
    r_result.get().title.set(i_title);
    r_result.get().sort_field.set(i_sort_field);
    r_result.get().descending.set(i_descending);
    r_result.get().mr_tab.set((await abap.Classes['Z2UI5_CL_UTIL'].conv_copy_ref_data({from: i_tab})));
    abap.statements.createData(r_result.get().ms_result.get().row,{"likeLineOf": i_tab});
    return r_result;
  }
  async display() {
    let fs_tab_out_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
    let popup = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    let temp1 = abap.types.TableFactory.construct(new abap.types.String({qualifiedName: "STRING"}), {"withHeader":false,"keyType":"DEFAULT","primaryKey":{"isUnique":false,"type":"STANDARD","keyFields":[],"name":"primary_key"},"secondary":[]}, "STRING_TABLE");
    let temp2 = abap.types.TableFactory.construct(new abap.types.String({qualifiedName: "STRING"}), {"withHeader":false,"keyType":"DEFAULT","primaryKey":{"isUnique":false,"type":"STANDARD","keyFields":[],"name":"primary_key"},"secondary":[]}, "STRING_TABLE");
    let tab = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    let lt_comp = abap.types.TableFactory.construct(new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {}), {"withHeader":false,"keyType":"DEFAULT","primaryKey":{"name":"primary_key","type":"STANDARD","isUnique":false,"keyFields":[]},"secondary":[]}, "abap_component_tab");
    let list = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    let cells = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    let ls_comp = new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {});
    let columns = new abap.types.ABAPObject({qualifiedName: "Z2UI5_CL_XML_VIEW", RTTIName: "\\CLASS=Z2UI5_CL_XML_VIEW"});
    let temp3 = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_ELEMDESCR", RTTIName: "\\CLASS=CL_ABAP_ELEMDESCR"});
    let temp5 = new abap.types.String({qualifiedName: "Z2UI5_CL_UTIL_STMPNCFCTN=>TY_DATA_ELEMENT_TEXTS-MEDIUM"});
    let data_element_name = new abap.types.String({qualifiedName: "STRING"});
    let medium_label = new abap.types.String({qualifiedName: "Z2UI5_CL_UTIL_STMPNCFCTN=>TY_DATA_ELEMENT_TEXTS-MEDIUM"});
    let text = new abap.types.String({qualifiedName: "Z2UI5_CL_UTIL_STMPNCFCTN=>TY_DATA_ELEMENT_TEXTS-MEDIUM"});
    abap.statements.assign({target: fs_tab_out_, source: (this.mr_tab_popup).dereference()});
    popup.set((await abap.Classes['Z2UI5_CL_XML_VIEW'].factory_popup()));
    abap.statements.clear(temp1);
    abap.statements.insertInternal({data: new abap.types.String().set(`\${$parameters>/value}`), table: temp1});
    abap.statements.insertInternal({data: new abap.types.String().set(`\${$parameters>/clearButtonPressed}`), table: temp1});
    abap.statements.clear(temp2);
    abap.statements.insertInternal({data: new abap.types.String().set(`\${$parameters>/selectedContexts[0]/sPath}`), table: temp2});
    tab.set((await popup.get().table_select_dialog({items: abap.operators.concat(new abap.types.String().set(`{path:'`),abap.operators.concat((await this.client.get().z2ui5_if_client$_bind_edit({val: fs_tab_out_, path: abap.builtin.abap_true})),abap.operators.concat(new abap.types.String().set(`', sorter : { path : '`),abap.operators.concat(abap.builtin.to_upper({val: this.sort_field}),abap.operators.concat(new abap.types.String().set(`', descending : `),abap.operators.concat((await abap.Classes['Z2UI5_CL_UTIL'].boolean_abap_2_json({val: this.me.get().descending})),new abap.types.String().set(` } }`))))))), cancel: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(6).set('CANCEL')})), search: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(6).set('SEARCH'), t_arg: temp1})), confirm: (await this.client.get().z2ui5_if_client$_event({val: new abap.types.Character(7).set('CONFIRM'), t_arg: temp2})), growing: abap.builtin.abap_true, title: this.title})));
    lt_comp.set((await abap.Classes['Z2UI5_CL_UTIL'].rtti_get_t_attri_by_struc({val: fs_tab_out_})));
    await abap.statements.deleteInternal(lt_comp,{where: (I) => {return abap.compare.eq(I.name, new abap.types.Character(7).set('ZZSELKZ'));}});
    list.set((await tab.get().column_list_item({valign: new abap.types.String().set(`Top`), selected: new abap.types.String().set(`{ZZSELKZ}`)})));
    cells.set((await list.get().cells()));
    for await (const unique190 of abap.statements.loop(lt_comp)) {
      ls_comp.set(unique190);
      await cells.get().text({text: abap.operators.concat(new abap.types.String().set(`{`),abap.operators.concat(ls_comp.get().name,new abap.types.String().set(`}`)))});
    }
    columns.set((await tab.get().columns()));
    for await (const unique191 of abap.statements.loop(lt_comp)) {
      ls_comp.set(unique191);
      await abap.statements.cast(temp3, ls_comp.get().type);
      data_element_name.set(abap.builtin.substring_after({val: temp3.get().absolute_name, sub: new abap.types.Character(6).set('\\TYPE=')}));
      medium_label.set(((await abap.Classes['Z2UI5_CL_UTIL'].rtti_get_data_element_texts({i_data_element_name: data_element_name}))).get().medium);
      if (abap.compare.initial(medium_label) === false) {
        temp5.set(medium_label);
      } else {
        temp5.set(ls_comp.get().name);
      }
      text.set(temp5);
      await (await (await columns.get().column({width: new abap.types.Character(4).set('8rem')})).get().header({ns: new abap.types.String().set(``)})).get().text({text: text});
    }
    await this.client.get().z2ui5_if_client$popup_display({val: (await popup.get().stringify())});
  }
  async z2ui5_if_app$main(INPUT) {
    let client = INPUT?.client;
    if (client?.getQualifiedName === undefined || client.getQualifiedName() !== "Z2UI5_IF_CLIENT") { client = undefined; }
    if (client === undefined) { client = new abap.types.ABAPObject({qualifiedName: "Z2UI5_IF_CLIENT", RTTIName: "\\INTERFACE=Z2UI5_IF_CLIENT"}).set(INPUT.client); }
    this.me.get().client.set(client);
    if (abap.compare.eq(this.check_initialized, abap.builtin.abap_false)) {
      this.check_initialized.set(abap.builtin.abap_true);
      await this.set_output_table();
      await this.display();
      return;
    }
    await this.on_event();
  }
  async on_event() {
    let unique192 = ((await this.client.get().z2ui5_if_client$get())).get().event;
    if (abap.compare.eq(unique192, new abap.types.Character(7).set('CONFIRM'))) {
      this.ms_result.get().check_confirmed.set(abap.builtin.abap_true);
      await this.on_event_confirm();
    } else if (abap.compare.eq(unique192, new abap.types.Character(6).set('CANCEL'))) {
      await this.client.get().z2ui5_if_client$popup_destroy();
      await this.client.get().z2ui5_if_client$nav_app_leave({app: (await this.client.get().z2ui5_if_client$get_app({id: ((await this.client.get().z2ui5_if_client$get())).get().s_draft.get().id_prev_app_stack}))});
    } else if (abap.compare.eq(unique192, new abap.types.Character(6).set('SEARCH'))) {
      await this.on_event_search();
    }
  }
  async result() {
    let result = new abap.types.Structure({"row": new abap.types.DataReference(new abap.types.Character(4)), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_to_select=>ty_s_result", undefined, {}, {});
    result.set(this.ms_result);
    return result;
  }
  async set_output_table() {
    let fs_row_ = new abap.types.FieldSymbol(new abap.types.Character(4));
    let fs_row2_ = new abap.types.FieldSymbol(new abap.types.Character(4));
    let fs_tab_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
    let fs_tab_out_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
    let fs_tab_out2_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
    let fs_field_ = new abap.types.FieldSymbol(new abap.types.Character(4));
    let lr_row = new abap.types.DataReference(new abap.types.Character(4));
    let lo_type = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_TYPEDESCR", RTTIName: "\\CLASS=CL_ABAP_TYPEDESCR"});
    let temp4 = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_TABLEDESCR", RTTIName: "\\CLASS=CL_ABAP_TABLEDESCR"});
    let lo_table = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_TABLEDESCR", RTTIName: "\\CLASS=CL_ABAP_TABLEDESCR"});
    let temp5 = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_STRUCTDESCR", RTTIName: "\\CLASS=CL_ABAP_STRUCTDESCR"});
    let lo_struct = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_STRUCTDESCR", RTTIName: "\\CLASS=CL_ABAP_STRUCTDESCR"});
    let lt_comp = abap.types.TableFactory.construct(new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {}), {"withHeader":false,"keyType":"DEFAULT","primaryKey":{"name":"primary_key","type":"STANDARD","isUnique":false,"keyFields":[]},"secondary":[]}, "abap_component_tab");
    let temp6 = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_ELEMDESCR", RTTIName: "\\CLASS=CL_ABAP_ELEMDESCR"});
    let lo_elem = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_ELEMDESCR", RTTIName: "\\CLASS=CL_ABAP_ELEMDESCR"});
    let temp7 = new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {});
    let temp9 = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"});
    let lo_type_bool = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_TYPEDESCR", RTTIName: "\\CLASS=CL_ABAP_TYPEDESCR"});
    let temp8 = new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {});
    let temp10 = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"});
    let lo_line_type = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_STRUCTDESCR", RTTIName: "\\CLASS=CL_ABAP_STRUCTDESCR"});
    let lo_tab_type = new abap.types.ABAPObject({qualifiedName: "CL_ABAP_TABLEDESCR", RTTIName: "\\CLASS=CL_ABAP_TABLEDESCR"});
    abap.statements.assign({target: fs_tab_, source: (this.mr_tab).dereference()});
    lo_type.set((await abap.Classes['CL_ABAP_STRUCTDESCR'].describe_by_data({p_data: fs_tab_})));
    await abap.statements.cast(temp4, lo_type);
    lo_table.set(temp4);
    try {
      await abap.statements.cast(temp5, (await lo_table.get().get_table_line_type()));
      lo_struct.set(temp5);
      lt_comp.set((await lo_struct.get().get_components()));
    } catch (e) {
      if ((abap.Classes['CX_ROOT'] && e instanceof abap.Classes['CX_ROOT'])) {
        this.check_table_line.set(abap.builtin.abap_true);
        await abap.statements.cast(temp6, (await lo_table.get().get_table_line_type()));
        lo_elem.set(temp6);
        abap.statements.clear(temp7);
        temp7.get().name.set(new abap.types.Character(8).set('TAB_LINE'));
        await abap.statements.cast(temp9, lo_elem);
        temp7.get().type.set(temp9);
        abap.statements.insertInternal({data: temp7, table: lt_comp});
      } else {
        throw e;
      }
    }
    lo_type_bool.set((await abap.Classes['CL_ABAP_STRUCTDESCR'].describe_by_name({p_name: new abap.types.Character(9).set('ABAP_BOOL')})));
    abap.statements.clear(temp8);
    temp8.get().name.set(new abap.types.String().set(`ZZSELKZ`));
    await abap.statements.cast(temp10, lo_type_bool);
    temp8.get().type.set(temp10);
    abap.statements.insertInternal({data: temp8, table: lt_comp});
    lo_line_type.set((await abap.Classes['CL_ABAP_STRUCTDESCR'].create({p_components: lt_comp})));
    lo_tab_type.set((await abap.Classes['CL_ABAP_TABLEDESCR'].create({p_line_type: lo_line_type})));
    if (abap.Classes['KERNEL_CREATE_DATA_HANDLE'] === undefined) throw new Error("CreateData, kernel class missing");
    await abap.Classes['KERNEL_CREATE_DATA_HANDLE'].call({handle: lo_tab_type, dref: this.mr_tab_popup});
    if (abap.Classes['KERNEL_CREATE_DATA_HANDLE'] === undefined) throw new Error("CreateData, kernel class missing");
    await abap.Classes['KERNEL_CREATE_DATA_HANDLE'].call({handle: lo_tab_type, dref: this.mr_tab_popup_backup});
    abap.statements.assign({target: fs_tab_out_, source: (this.mr_tab_popup).dereference()});
    abap.statements.assign({target: fs_tab_out2_, source: (this.mr_tab_popup_backup).dereference()});
    for await (const unique193 of abap.statements.loop(fs_tab_)) {
      fs_row_.assign(unique193);
      abap.statements.createData(lr_row,{"likeLineOf": fs_tab_out_});
      abap.statements.assign({target: fs_row2_, source: (lr_row).dereference()});
      if (abap.compare.eq(this.check_table_line, abap.builtin.abap_true)) {
        abap.statements.assign({target: fs_field_, dynamicName: 'lr_row' + '->' + 'TAB_LINE', dynamicSource: (() => {
                    try { return lr_row; } catch {}
                    try { return this.lr_row; } catch {}
                  })()});
          abap.statements.assert(abap.compare.eq(abap.builtin.sy.get().subrc, abap.IntegerFactory.get(0)));
          fs_field_.set(fs_row_);
        } else {
          abap.statements.moveCorresponding(fs_row_, fs_row2_);
        }
        abap.statements.insertInternal({data: fs_row2_, table: fs_tab_out_});
      }
      fs_tab_out2_.set(fs_tab_out_);
    }
    async on_event_confirm() {
      let fs_tab_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
      let fs_row_selected_ = new abap.types.FieldSymbol(new abap.types.Character(4));
      let fs_selkz_ = new abap.types.FieldSymbol(new abap.types.Character(4));
      let fs_row_result_ = new abap.types.FieldSymbol(new abap.types.Character(4));
      let fs_table_line_selected_ = new abap.types.FieldSymbol(new abap.types.Character(4));
      abap.statements.assign({target: fs_tab_, source: (this.mr_tab_popup).dereference()});
      for await (const unique194 of abap.statements.loop(fs_tab_)) {
        fs_row_selected_.assign(unique194);
        abap.statements.assign({target: fs_selkz_, dynamicName: '<ROW_SELECTED>-ZZSELKZ', dynamicSource: (() => {
                      try { return row_selected; } catch {}
                      try { return this.row_selected; } catch {}
                    })()});
          abap.statements.assert(abap.compare.eq(abap.builtin.sy.get().subrc, abap.IntegerFactory.get(0)));
          if (abap.compare.eq(fs_selkz_, abap.builtin.abap_false)) {
            continue;
          }
          abap.statements.assign({target: fs_row_result_, source: (this.ms_result.get().row).dereference()});
          if (abap.compare.eq(this.check_table_line, abap.builtin.abap_true)) {
            abap.statements.assign({target: fs_table_line_selected_, dynamicName: '<ROW_SELECTED>-TAB_LINE', dynamicSource: (() => {
                          try { return row_selected; } catch {}
                          try { return this.row_selected; } catch {}
                        })()});
              abap.statements.assert(abap.compare.eq(abap.builtin.sy.get().subrc, abap.IntegerFactory.get(0)));
              fs_row_result_.set(fs_table_line_selected_);
            } else {
              abap.statements.moveCorresponding(fs_row_selected_, fs_row_result_);
            }
            break;
          }
          await this.client.get().z2ui5_if_client$popup_destroy();
          await this.client.get().z2ui5_if_client$nav_app_leave({app: (await this.client.get().z2ui5_if_client$get_app({id: ((await this.client.get().z2ui5_if_client$get())).get().s_draft.get().id_prev_app_stack}))});
        }
        async on_event_search() {
          let fs_tab_out_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
          let fs_tab_out_backup_ = new abap.types.FieldSymbol(abap.types.TableFactory.construct(new abap.types.Character(4), {"withHeader":false,"keyType":"DEFAULT"}));
          let fs_row2_ = new abap.types.FieldSymbol(new abap.types.Character(4));
          let fs_field2_ = new abap.types.FieldSymbol(new abap.types.Character(4));
          let lt_arg = abap.types.TableFactory.construct(new abap.types.String({qualifiedName: "STRING"}), {"withHeader":false,"keyType":"DEFAULT","primaryKey":{"isUnique":false,"type":"STANDARD","keyFields":[],"name":"primary_key"},"secondary":[]}, "STRING_TABLE");
          let ls_arg = new abap.types.String({qualifiedName: "STRING"});
          let lt_comp = abap.types.TableFactory.construct(new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {}), {"withHeader":false,"keyType":"DEFAULT","primaryKey":{"name":"primary_key","type":"STANDARD","isUnique":false,"keyFields":[]},"secondary":[]}, "abap_component_tab");
          let lv_check_continue = new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"});
          let ls_comp = new abap.types.Structure({"name": new abap.types.String({qualifiedName: "NAME"}), "type": new abap.types.ABAPObject({qualifiedName: "CL_ABAP_DATADESCR", RTTIName: "\\CLASS=CL_ABAP_DATADESCR"}), "as_include": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"}), "suffix": new abap.types.String({qualifiedName: "SUFFIX"})}, "abap_componentdescr", undefined, {}, {});
          let lv_assign = new abap.types.String({qualifiedName: "STRING"});
          lt_arg.set(((await this.client.get().z2ui5_if_client$get())).get().t_event_arg);
          abap.statements.readTable(lt_arg,{index: abap.IntegerFactory.get(1),
            into: ls_arg});
          abap.statements.assert(abap.compare.eq(abap.builtin.sy.get().subrc, abap.IntegerFactory.get(0)));
          abap.statements.assign({target: fs_tab_out_, source: (this.mr_tab_popup).dereference()});
          abap.statements.assign({target: fs_tab_out_backup_, source: (this.mr_tab_popup_backup).dereference()});
          fs_tab_out_.set(fs_tab_out_backup_);
          lt_comp.set((await abap.Classes['Z2UI5_CL_UTIL'].rtti_get_t_attri_by_struc({val: fs_tab_out_})));
          for await (const unique195 of abap.statements.loop(fs_tab_out_)) {
            fs_row2_.assign(unique195);
            lv_check_continue.set(abap.builtin.abap_false);
            for await (const unique196 of abap.statements.loop(lt_comp)) {
              ls_comp.set(unique196);
              lv_assign.set(abap.operators.concat(new abap.types.Character(7).set('<ROW2>-'),ls_comp.get().name));
              abap.statements.assign({target: fs_field2_, dynamicName: lv_assign.get(), dynamicSource: (() => {
                            const name = lv_assign.get().toLowerCase().replace(/[~\/]/g, "$").match(/[\w\$\/]+/)[0];
                            try { return eval(name); } catch {}
                            try { return eval("this." + name); } catch {}
                          })()});
                abap.statements.assert(abap.compare.eq(abap.builtin.sy.get().subrc, abap.IntegerFactory.get(0)));
                if (abap.compare.cs(abap.builtin.to_upper({val: fs_field2_}), abap.builtin.to_upper({val: ls_arg}))) {
                  lv_check_continue.set(abap.builtin.abap_true);
                  break;
                }
              }
              if (abap.compare.eq(lv_check_continue, abap.builtin.abap_true)) {
                continue;
              }
              await abap.statements.deleteInternal(fs_tab_out_);
            }
            await this.client.get().z2ui5_if_client$popup_model_update();
          }
        }
        abap.Classes['Z2UI5_CL_POPUP_TO_SELECT'] = z2ui5_cl_popup_to_select;
        z2ui5_cl_popup_to_select.z2ui5_if_app$version = new abap.types.String({qualifiedName: "STRING"});
        z2ui5_cl_popup_to_select.z2ui5_if_app$version.set('1.120.0');
        z2ui5_cl_popup_to_select.z2ui5_if_app$origin = new abap.types.String({qualifiedName: "STRING"});
        z2ui5_cl_popup_to_select.z2ui5_if_app$origin.set('https://github.com/abap2UI5/abap2UI5');
        z2ui5_cl_popup_to_select.z2ui5_if_app$license = new abap.types.String({qualifiedName: "STRING"});
        z2ui5_cl_popup_to_select.z2ui5_if_app$license.set('MIT');
        z2ui5_cl_popup_to_select.ty_s_result = new abap.types.Structure({"row": new abap.types.DataReference(new abap.types.Character(4)), "check_confirmed": new abap.types.Character(1, {"qualifiedName":"ABAP_BOOL","ddicName":"ABAP_BOOL"})}, "z2ui5_cl_popup_to_select=>ty_s_result", undefined, {}, {});
export {z2ui5_cl_popup_to_select};
//# sourceMappingURL=z2ui5_cl_popup_to_select.clas.mjs.map