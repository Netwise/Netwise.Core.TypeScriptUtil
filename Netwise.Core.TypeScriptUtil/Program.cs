using Netwise.Core.TypeScriptUtil.Connector;
using Netwise.Core.TypeScriptUtil.DataModel;
using Netwise.Core.TypeScriptUtil.T4_Templates;
using System;
using System.Collections.Generic;

namespace Netwise.Core.TypeScriptUtil
{
    class Program
    {
        static void Main(string[] args)
        {
            var conn = new CrmConnector();

         


            var names = new List<Tuple<string,string>>();
            names.Add(new Tuple<string, string>("account", "Account"));

            var entities = conn.GetEntitiesMetadata(names);
            var forms = new List<EntityForm>();
            foreach (var entity in entities)
            {
                conn.GetFormData(entity);
                forms.AddRange(Translator.TranslatorService.CreateEntityForm(entity));
            }

            var templateEngine = new EntityFormTemplate(forms[0]);

            var tempate = templateEngine.TransformText();

        }
    }
}
