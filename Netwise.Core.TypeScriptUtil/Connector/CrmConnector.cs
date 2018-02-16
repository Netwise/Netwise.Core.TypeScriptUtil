using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Tooling.Connector;
using Netwise.Core.TypeScriptUtil.DataModel;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Netwise.Core.TypeScriptUtil.Connector
{
    internal class CrmConnector
    {
        private CrmServiceClient Client { get; set; }

        public CrmConnector()
        {
            this.Client = new CrmServiceClient(ConfigurationManager.ConnectionStrings["D365"].ConnectionString);

            if (!this.Client.IsReady)
                throw new Exception(this.Client.LastCrmError);
        }
        internal List<EntityInfo> GetEntitiesMetadata()
        {
            var req = new Microsoft.Xrm.Sdk.Messages.RetrieveAllEntitiesRequest()
            {
                EntityFilters = EntityFilters.Entity,
                RetrieveAsIfPublished = true
            };

            var resp = this.Client.Execute(req);
            var list = ((Microsoft.Xrm.Sdk.Metadata.EntityMetadata[])resp.Results["EntityMetadata"]).Select(i => new Tuple<string, string>(i.LogicalName, i.DisplayName.ToString())).ToList();

            return this.GetEntitiesMetadata(list);
        }
        internal List<EntityInfo> GetEntitiesMetadata(List<Tuple<string, string>> entities)
        {
            var result = new List<EntityInfo>();

            entities.ForEach(i => result.Add(new EntityInfo() { Name = i.Item1, DisplayName = i.Item2, Attributes = Client.GetAllAttributesForEntity(i.Item1) }));

            return result;
        }

        public void GetFormData(EntityInfo info)
        {
            var t = this.Client.GetEntityMetadata(info.Name, EntityFilters.All);
            var x = this.Client.GetEntityFormIdListByType(info.Name, CrmServiceClient.FormTypeId.Main);
            foreach (var formId in x)
            {
                var systemForm = this.Client.Retrieve("systemform", formId.Id, new Microsoft.Xrm.Sdk.Query.ColumnSet("formxml", "name"));
                info.FormXmls.Add(systemForm["name"].ToString(), systemForm["formxml"].ToString());
            }
        }
    }
}
