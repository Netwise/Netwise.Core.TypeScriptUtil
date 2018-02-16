using Netwise.Core.TypeScriptUtil.DataModel;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace Netwise.Core.TypeScriptUtil.T4_Templates
{
    public partial class EntityFormTemplate
    {
        internal EntityFormTemplate(EntityForm formDefinition)
        {
            this.Name = formDefinition.Name;
            this.Tabs = formDefinition.Tabs;
            this.Sections = formDefinition.Sections;
            this.Fields = formDefinition.Fields;
            this.Enums = formDefinition.Enums;
            this.EntityName = formDefinition.EntityName;
        }

        internal string Name { get; set; }
        internal List<FormElement> Tabs { get; set; } = new List<FormElement>();
        internal List<FormElement> Sections { get; set; } = new List<FormElement>();
        internal List<FormField> Fields { get; set; } = new List<FormField>();
        internal List<FormEnum> Enums { get; set; } = new List<FormEnum>();
        internal string EntityName { get; set; }


        public string ToAlphaNumeric(string value)
        {
            Regex rgx = new Regex("[^a-zA-Z0-9 _]");
            value = rgx.Replace(value, "").Replace(" ", "_");

            if (Char.IsDigit(value[0]))
                value = "_" + value;

            return value;
        }
    }
}
