using kartta.Models;
using Microsoft.SharePoint.Client;
using SPMeta2.CSOM.Services;
using SPMeta2.Syntax.Default;

namespace kartta
{
    class Program
    {
        static void Main(string[] args)
        {
            var model = GoogleMapsModel.GetModel();
            //set watch: serialized, nq
            var serialized = SPMeta2Model.ToXML(model);
            var siteUrl = "http://dev";
            var context = new ClientContext(siteUrl);
            var provisionService = new CSOMProvisionService();
            provisionService.DeployWebModel(context, model);
        }
    }
}
