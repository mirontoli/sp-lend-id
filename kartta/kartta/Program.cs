using kartta.Models;
using Microsoft.SharePoint.Client;
using SPMeta2.CSOM.Services;

namespace kartta
{
    class Program
    {
        static void Main(string[] args)
        {
            var model = GoogleMapsModel.GetModel();
            var siteUrl = "http://dev";
            var context = new ClientContext(siteUrl);
            var provisionService = new CSOMProvisionService();
            provisionService.DeployWebModel(context, model);
        }
    }
}
