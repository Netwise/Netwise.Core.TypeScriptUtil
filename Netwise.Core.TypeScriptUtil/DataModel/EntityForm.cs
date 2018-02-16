using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Netwise.Core.TypeScriptUtil.DataModel
{
    internal class EntityForm
    {
        public string Name { get; set; }
        public List<FormElement> Tabs { get; private set; } = new List<FormElement>();
        public List<FormElement> Sections { get; private set; } = new List<FormElement>();

        public List<FormField> Fields { get; set; } = new List<FormField>();

        public List<FormEnum> Enums { get; set; } = new List<FormEnum>();
        public string EntityName { get; internal set; }
    }
}
