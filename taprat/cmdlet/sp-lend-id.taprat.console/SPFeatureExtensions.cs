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
            ConstructorInfo propCollConstr = typeof(SPFeaturePropertyCollection).GetConstructors(BindingFlags.NonPublic | BindingFlags.Instance)[0];
            SPFeaturePropertyCollection properties = (SPFeaturePropertyCollection) propCollConstr.Invoke(new object[] { null });
            foreach (string key in activationProps.Keys)
            {
                properties.Add(new SPFeatureProperty(key, activationProps[key]));
            }           
            return ActivateFeature(features, featureId, properties);
        }
        private static SPFeature ActivateFeature(this SPFeatureCollection features, Guid featureId, SPFeaturePropertyCollection properties)
        {
            MethodInfo getFeatureInternal = typeof(SPFeatureCollection)
                .GetMethod("GetFeature", BindingFlags.Instance | BindingFlags.NonPublic, null,
                    new Type[] { typeof(Guid) }, null);
            SPFeature alreadyActivatedFeature = (SPFeature)getFeatureInternal
                .Invoke(features, new object[] { featureId });
            if (alreadyActivatedFeature != null)
                // The feature is already activated. No action required
                return null;
            MethodInfo addInternal = typeof(SPFeatureCollection)
                .GetMethod("Add", BindingFlags.Instance | BindingFlags.NonPublic, null,
                    new Type[] { typeof(Guid), typeof(SPFeaturePropertyCollection), typeof(bool) }, null);
            object result = addInternal.Invoke(features, new object[] { featureId, properties, false });
            return result as SPFeature;
        }
    }
}
