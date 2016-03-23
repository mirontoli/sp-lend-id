using System;
using System.Collections.Generic;
using Microsoft.SharePoint;

namespace sp_lend_id.taprat.console
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var site = new SPSite("http://dev"))
            {
                using (var web = site.OpenWeb())
                {
                    var activationProps = new Dictionary<string, string>
                                              {{"Test", "Title changed by feature in activation"}};
                    web.Features.ActivateFeature(new Guid("b5eef7d1-f46f-44d1-b53e-410f62032846"), activationProps);
                }
            }
        }
    }
}
