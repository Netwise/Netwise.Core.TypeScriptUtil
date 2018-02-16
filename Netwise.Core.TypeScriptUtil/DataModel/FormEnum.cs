using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Netwise.Core.TypeScriptUtil.DataModel
{
   internal class FormEnum
    {
        internal string Name { get; set; }
        internal Dictionary<int, string> Values { get; set; } = new Dictionary<int, string>();
    }
}
