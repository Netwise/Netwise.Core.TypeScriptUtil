using Microsoft.Xrm.Sdk.Metadata;
using Netwise.Core.TypeScriptUtil.DataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Netwise.Core.TypeScriptUtil.Translator
{
    public static class TranslatorService
    {
        internal static List<EntityForm> CreateEntityForm(EntityInfo info)
        {
            var result = new List<EntityForm>();

            foreach (var formStr in info.FormXmls)
            {
                var form = new EntityForm();
                form.EntityName = info.Name.ToAlphaNumeric();
                form.Name = formStr.Key.ToAlphaNumeric();
                var formXml = XDocument.Parse(formStr.Value);
                var tabs = formXml.Descendants(XName.Get("tab")).ToList();

                for (var i = 0; i < tabs.Count; i++)

                {
                    form.Tabs.Add(new FormElement() { Name = tabs[i].Attribute(XName.Get("name")).Value, Number = i });
                    tabs[i].Descendants(XName.Get("section")).ToList().ForEach(j => form.Sections.Add(new FormElement() { Name = j.Attribute(XName.Get("name")).Value, Number = i }));
                }

                var fields = formXml.Descendants(XName.Get("control")).ToList();
                foreach (var field in fields)
                {
                    var name = field.Attribute(XName.Get("id")).Value;
                    var type = info.Attributes.FirstOrDefault(i => i.LogicalName == name);
                    if (type != null)
                    {
                        form.Fields.Add(new FormField() { Name = name, Type = GetTypescriptType(type) });
                    }
                }


                if (result.Any(i => i.Enums.Count > 0))
                {
                    form.Enums = result.First(i => i.Enums.Count > 0).Enums;
                }
                else
                {
                    form.Enums = GetEnums(info.Attributes);
                }
                result.Add(form);
            }


            return result;
        }

        private static List<FormEnum> GetEnums(List<AttributeMetadata> attributes)
        {
            var result = new List<FormEnum>();
            foreach (PicklistAttributeMetadata picklist in attributes.Where(o => o.AttributeTypeName.Value == "PicklistType"))
            {
                result.Add(new FormEnum() { Name = picklist.OptionSet.Name.ToAlphaNumeric(), Values = GetPicklistValues(picklist.OptionSet.Options) });
            }
            return result;
        }

        private static Dictionary<int, string> GetPicklistValues(OptionMetadataCollection options)
        {
            var result = new Dictionary<int, string>();

            foreach (var item in options)
            {
                result.Add(item.Value.Value, item.Label.UserLocalizedLabel.Label.ToString().ToAlphaNumeric());
            }

            return result;
        }

        private static string GetTypescriptType(AttributeMetadata crmType)
        {
            var result = "";
            switch (crmType.AttributeType.Value.ToString().ToLower())
            {
                case "uniqueidentifier":
                case "memo":
                case "string":
                    result = "string";
                    break;
                case "boolean":
                    result = "boolean";
                    break;
                case "decimal":
                case "integer":
                case "money":
                    result = "number";
                    break;
                case "picklist":
                    result = $"{((PicklistAttributeMetadata)crmType).OptionSet.Name}Enum";
                    break;
                case "customer":
                case "owner":
                case "lookup":
                    result = "Netwise.Common.Lookup";
                    break;
                case "datetime":
                    result = "Date";
                    break;
                default:
                    throw new Exception("Type not recognized!");
            }



            return result;
        }



        public static string ToAlphaNumeric(this string value)
        {
            Regex rgx = new Regex("[^a-zA-Z0-9 _]");
            value = rgx.Replace(value, "").Replace(" ", "_");

            if (Char.IsDigit(value[0]))
                value = "_" + value;

            return value;
        }
    }
}
