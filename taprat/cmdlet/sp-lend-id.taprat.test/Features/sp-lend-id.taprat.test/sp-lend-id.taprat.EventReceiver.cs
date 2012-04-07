using System.Runtime.InteropServices;
using Microsoft.SharePoint;

namespace sp_lend_id.taprat.test.Features.sp_lend_id.taprat.test
{
    /// <summary>
    /// This class handles events raised during feature activation, deactivation, installation, uninstallation, and upgrade.
    /// </summary>
    /// <remarks>
    /// The GUID attached to this class may be used during packaging and should not be modified.
    /// </remarks>

    [Guid("f238a7a9-8594-4fdc-9c97-2e38ac499261")]
    public class sp_lend_idtapratEventReceiver : SPFeatureReceiver
    {
        public override void FeatureActivated(SPFeatureReceiverProperties properties)
        {
            var web = properties.Feature.Parent as SPWeb;
            if (web != null)
            {
                var allow = web.AllowUnsafeUpdates;
                web.AllowUnsafeUpdates = true;
                if (properties.Feature.Properties["Test"] != null)
                {
                    web.Title = properties.Feature.Properties["Test"].Value;
                    web.Update();
                }
                web.AllowUnsafeUpdates = allow;
            }
        }
    }
}
