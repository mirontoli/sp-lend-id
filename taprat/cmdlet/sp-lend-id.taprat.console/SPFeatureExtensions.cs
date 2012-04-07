using System;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.SharePoint;

namespace sp_lend_id.taprat.console
{
    /// <summary>
    /// This class extends the SPFeature
    /// for activating with additional properties
    /// found in Yaroslav Pentsarsky's blog:
    /// http://www.sharemuch.com/2010/12/02/activating-sharepoint-2010-features-with-properties/
    /// </summary>
    public static class SPFeatureExtensions
    {
        public static SPFeature ActivateFeature(this SPFeatureCollection features, Guid featureId, Dictionary<string, string> activationProps)
        {
            var propCollConstr = typeof(SPFeaturePropertyCollection).GetConstructors(BindingFlags.NonPublic | BindingFlags.Instance)[0];
            var properties = (SPFeaturePropertyCollection) propCollConstr.Invoke(new object[] { null });
            foreach (var key in activationProps.Keys)
            {
                properties.Add(new SPFeatureProperty(key, activationProps[key]));
            }           
            return ActivateFeature(features, featureId, properties);
        }
        private static SPFeature ActivateFeature(this SPFeatureCollection features, Guid featureId, SPFeaturePropertyCollection properties)
        {
            var getFeatureInternal = typeof(SPFeatureCollection)
                .GetMethod("GetFeature", BindingFlags.Instance | BindingFlags.NonPublic, null,
                    new[] { typeof(Guid) }, null);
            var alreadyActivatedFeature = (SPFeature)getFeatureInternal
                .Invoke(features, new object[] { featureId });
            if (alreadyActivatedFeature != null)
                // The feature is already activated. No action required
                return null;
            var addInternal = typeof(SPFeatureCollection)
                .GetMethod("Add", BindingFlags.Instance | BindingFlags.NonPublic, null,
                    new[] { typeof(Guid), typeof(SPFeaturePropertyCollection), typeof(bool) }, null);
            var result = addInternal.Invoke(features, new object[] { featureId, properties, false });
            return result as SPFeature;
        }
    }
}
