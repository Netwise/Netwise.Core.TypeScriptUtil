using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Netwise.Core.TypeScriptUtil.DataModel
{
    internal class EntityInfo
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public Dictionary<string, string> FormXmls { get; set; } = new Dictionary<string, string>();
        public List<AttributeMetadata> Attributes { get; set; } = new List<AttributeMetadata>();
        
    }
    
}