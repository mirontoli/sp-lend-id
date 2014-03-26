using System;
using System.Runtime.InteropServices;
using System.Security.Permissions;
using Microsoft.SharePoint;

namespace COB.SharePoint.AccordionList.Features.AccordionList
{
    /// <summary>
    /// Adds a custom CSS file reference so that jQuery UI branding is applied. Also deletes the accordion list on deactivation. 
    /// </summary>
    /// <remarks>
    /// The GUID attached to this class may be used during packaging and should not be modified.
    /// </remarks>
    [Guid("e81dd029-cc9e-438a-bfeb-08539ad847c3")]
    public class AccordionListEventReceiver : SPFeatureReceiver
    {
        public override void FeatureActivated(SPFeatureReceiverProperties properties)
        {
            SPWeb parentWeb = (SPWeb)properties.Feature.Parent;
            parentWeb.AlternateCssUrl = "/SiteAssets/CSS/jquery-ui-1.9.2.custom.min.css";
            parentWeb.Update();
        }

        public override void FeatureDeactivating(SPFeatureReceiverProperties properties)
        {
            // N.B. a further (optional) enhancement would be delete provisioned files here..
            SPWeb parentWeb = (SPWeb)properties.Feature.Parent;
            SPList accordionList = parentWeb.Lists.TryGetList("Accordion list");
            if (accordionList != null)
            {
                parentWeb.Lists.Delete(accordionList.ID);
            }
            parentWeb.AlternateCssUrl = string.Empty;
            parentWeb.Update();
        }
    }
}
