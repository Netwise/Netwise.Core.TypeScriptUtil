/// <reference path="xrm-2015.d.ts" />


namespace Ntw.Core {

    export class Validators {

        constructor() { }
        static isEmailValid(inputval) {

            let _r = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (inputval == null || inputval == "") return true;

            if (!inputval.match(_r))
                return false;
            return true;
        }

        static isPhoneNumberValid(attributeName) {
            let inputVal = Statics.GetValue(attributeName);
            let _label = Statics.GetAttributeLabel(attributeName);

            if (inputVal == null) return;
            if (!inputVal.match(/^\+[0-9]{11}$/)) {
                alert(_label + "Podany numer ma niepoprawny format. Poprawnym formatem numerpw telefonpw jest: +48123456789");
                event.returnValue = false;
            }
        }

        static isNipValid(inputVal) {

            if (inputVal == null) return true;
            if (!inputVal.match(/^[0-9]{10}$/))
                return false;
            let my_nums = inputVal.replace(/-/g, '');
            let valid_nums = "657234567";
            let sum = 0;
            for (let temp = 8; temp >= 0; temp--)
                sum += (parseInt(valid_nums.charAt(temp)) * parseInt(my_nums.charAt(temp)));
            if ((sum % 11) == 10 ? false : ((sum % 11) == parseInt(my_nums.charAt(9))))
                return true;
            else
                return false;

        }

        static isRegonValid(inputVal) {
            if (inputVal == null) return true;
            if (!inputVal.match(/^[0-9]{7}$/) && !inputVal.match(/^[0-9]{9}$/) && !inputVal.match(/^[0-9]{14}$/))
                return false;

            return true;
        }

        static isUserInRole(roleName: string, checkOnlyName?: boolean) {

            let roleIds = Xrm.Page.context.getUserRoles();

            for (let index = 0; index < roleIds.length; ++index) {
                ///TODO: Implement proper role verification
                // let role = XrmContext.RetrieveRecordById("Role", roleIds[index]);
                // if (role.name == roleName)
                //     return true;
            }
            return false;
        }

        static get FormType(): FormType {

            let i = Xrm.Page.ui.getFormType();
            switch (i) {
                case 1:
                    return FormType.Create;
                case 2:
                    return FormType.Update;
                case 3:
                    return FormType.ReadOnly;
                case 4:
                    return FormType.Disabled;
                case 5:
                    return FormType.QuickCreate;
                case 6:
                    return FormType.BulkEdit;
            }
        }


    }
    ///TODO: Verification and implementation needed.
    class Statics {
        static GetValue(attributename: string) {

            let _attr = Xrm.Page.data.entity.attributes.get(attributename)
            if (_attr == null)
                return null;
            else if (_attr.getValue() != null && _attr.getValue()[0] != null && _attr.getValue()[0].id != null) {
                // we have lookup
                let tmp = _attr.getValue()[0];
                let l = new Lookup(tmp.id, tmp.name, tmp.typename);
                return l;

            }
            else
                return _attr.getValue();
        }
        static GetAttributeLabel(attributeName) {
            let _control = Xrm.Page.getControl(attributeName);

            if (_control != null) return _control.getLabel() + ": ";
            return "";
        }
        static GetLookupValue(attributename) {
            let lookupItem = new Array();
            lookupItem = Xrm.Page.getAttribute(attributename).getValue();

            if (lookupItem != null)
                return lookupItem[0];

            return null;

        }
        static SetValue(attributename, value) {
            let _attr = Xrm.Page.data.entity.attributes.get(attributename);
            if (_attr != null) {
                if (value.Id != null && value.LogicalName != null && value.Name != null)
                    _attr.setValue(Lookup.Get(value));
                else
                    _attr.setValue(value);
                _attr.setSubmitMode("always");

            }
        }
        static GetIsDitry(attributename) {
            return Xrm.Page.data.entity.attributes.get(attributename).getIsDirty();

        }
        static SetFocus(attributename) {
            let _attr = Xrm.Page.ui.controls.get(attributename);
            if (_attr != null) {
                _attr.setFocus();
            }
        }
        static DisableControl(control) {
            let _control = Xrm.Page.ui.controls.get(control);
            if (_control != null) {
                _control.setDisabled(true);
            }

        }
        static EnableControl(control) {
            let _control = Xrm.Page.ui.controls.get(control);
            if (_control != null) {
                _control.setDisabled(false);
            }
        }
        static SetRequiredLevel(attribute, reqlevel) {
            let _attr = Xrm.Page.data.entity.attributes.get(attribute);
            if (_attr != null) {
                _attr.setRequiredLevel(reqlevel);
            }
        }
        static GetRequiredLevel(attribute) {
            let _attr = Xrm.Page.data.entity.attributes.get(attribute);
            if (_attr != null) {
                return _attr.getRequiredLevel();
            }
            return null;
        }
        static ShowControl(control) {
            let _control = Xrm.Page.ui.controls.get(control);
            if (_control != null) {
                _control.setVisible(true);
            }
        }
        static HideControl(control) {
            let _control = Xrm.Page.ui.controls.get(control);
            if (_control != null) {
                _control.setVisible(false);
            }
        }
        static GetSection(tab, section) {
            let _tab = Xrm.Page.ui.tabs.get(tab);

            if (_tab != null) {
                let _sec = _tab.sections.get(section);
                return _sec
            }
        }
        static ShowHideSection(tab, section, visible) {
            let _tab = Xrm.Page.ui.tabs.get(tab);

            if (_tab != null) {
                let _sec = _tab.sections.get(section);

                if (_sec != null) {
                    _sec.setVisible(visible);
                }
            }
        }
        static HideTab(tabName) {
            let _tab = Xrm.Page.ui.tabs.get(tabName);
            if (_tab != null) {
                _tab.setVisible(false);
            }
        }
        static ShowTab(tabName) {
            let _tab = Xrm.Page.ui.tabs.get(tabName);
            if (_tab != null) {
                _tab.setVisible(true);
            }
        }
        static GetPicklistValue(attributename) {

            let _attr = Xrm.Page.data.entity.attributes.get(attributename)
            if (_attr != null)
                if (_attr.getSelectedOption() != null)
                    return _attr.getSelectedOption().value;
            return null;
        }
        static CreateObject(type, object) {
            throw "not implemented";
        }
        static ForceSubmit(attributename: string, force: string) {
            let _attr = Xrm.Page.data.entity.attributes.get(attributename);
            _attr.setSubmitMode(force);
        }
        static GetEntityById(entityname: string, id: string) {
            throw "not implemented"
        }

    }

    export class Section {
        Name: string;
        TabNumber: number;

        constructor(name: string, tabNumber: number) {
            this.Name = name;
            this.TabNumber = tabNumber;
        }



        get Visible() {
            let section = Statics.GetSection(this.TabNumber, this.Name);
            return section.getVisible();
        }
        set Visible(value: boolean) {
            let section = Statics.GetSection(this.TabNumber, this.Name);
            section.setVisible(value);
        }

        get Label() {
            let section = Statics.GetSection(this.TabNumber, this.Name);
            return section.getLabel();
        }
        set Label(value: string) {
            let section = Statics.GetSection(this.TabNumber, this.Name);
            section.setLabel(value);
        }

        get Tab() {
            let section = Statics.GetSection(this.TabNumber, this.Name);
            return section.getParent();
        }
    }

    export class Lookup {
        Id: string;
        Name: string;
        LogicalName: string;

        static Get(lookup: Lookup) {

            let _lookup = Object();
            _lookup.id = lookup.Id;
            _lookup.entityType = lookup.LogicalName;
            _lookup.name = lookup.Name;
            let _LookupValue = new Array();
            _LookupValue[0] = _lookup;
            return _LookupValue;
        }

        constructor(id: string, name: string, logicalName: string) {
            this.Id = id;
            this.Name = name;
            this.LogicalName = logicalName;
        }

    }

    export class Tab {

        Id: string;
        Number: number;

        constructor(n: number, i: string) {
            this.Id = i;
            this.Number = n;
        }


        Hide() {
            Statics.HideTab(this.Id);
        }
        Show() {
            Statics.ShowTab(this.Id);
        }
        set visible(value: boolean) {
            if (value) {
                this.Show();
            }
            else {
                this.Hide();
            }
        }
        get visible(): boolean {
            let _control = Xrm.Page.ui.controls.get(this.Id);
            if (_control != null) {
                return _control.getVisible();
            }
            return false;
        }



    }

    export class Field<T> {
        Name: string;

        private type: T;
        constructor(value: T, name: string, isFormBased: boolean) {
            this.Name = name;

            this.type = value;
        }

        AttachEvent(eventName: string, method: string) {

            let _attr = Xrm.Page.data.entity.attributes.get(this.Name).attachEventListener(eventName, method);

        }


        get value(): T {
            return Statics.GetValue(this.Name);
        }
        set value(value: T) {
            Statics.SetValue(this.Name, value);
        }

        get required() {
            let s = Statics.GetRequiredLevel(this.Name);
            if (s = "required") return RequiredLevel.required;
            if (s = "none") return RequiredLevel.none;
            if (s = "recommended") return RequiredLevel.recommended;
            return null;
        }
        set required(reqlevel: RequiredLevel) {
            switch (reqlevel) {
                case RequiredLevel.none:
                    Statics.SetRequiredLevel(this.Name, "none");
                    return;
                case RequiredLevel.recommended:
                    Statics.SetRequiredLevel(this.Name, "recommended");
                    return;
                case RequiredLevel.required:
                    Statics.SetRequiredLevel(this.Name, "required");
                    return;
            }
        }

        set submitMode(value: SubmitModeLevel) {
            let _control = Xrm.Page.ui.controls.get(this.Name);
            if (_control != null) {
                let stringVal = "";
                if (value == SubmitModeLevel.always) stringVal = "always";
                if (value == SubmitModeLevel.dirty) stringVal = "dirty";
                if (value == SubmitModeLevel.never) stringVal = "never";
                Statics.ForceSubmit(this.Name, stringVal)
            }
        }

        set enable(value: boolean) {
            if (value == true)
                Statics.EnableControl(this.Name);
            else
                Statics.DisableControl(this.Name);
        }
        get visible() {
            let _control = Xrm.Page.ui.controls.get(this.Name);
            if (_control != null) {
                return _control.getVisible();
            }
            return false;
        }
        set visible(value: boolean) {
            if (value == true)
                Statics.ShowControl(this.Name);
            else
                Statics.HideControl(this.Name);
        }
        isDirty() {
            return Statics.GetIsDitry(this.Name);
        }
        setFocus() {
            Statics.SetFocus(this.Name);
        }
        get UserPrivilege(): UserPrivilegeClass {
            let _attr = Xrm.Page.data.entity.attributes.get(this.Name);
            if (_attr != null)
                return _attr.getUserPrivilege();
            return null;
        }
    }

    interface List<T> {
        [name: string]: T;
        [index: number]: T;
    }

    export enum RequiredLevel { required, none, recommended }

    export enum SubmitModeLevel { always, never, dirty }

    export enum FormType { Create = 1, Update = 2, ReadOnly = 3, Disabled = 4, QuickCreate = 5, BulkEdit = 6 }

    export class UserPrivilegeClass {
        canRead: boolean;
        canUpdate: boolean;
        canCreate: boolean;
    }
}