using System;
using System.Collections.Generic;
using System.Reflection;
using Microsoft.SharePoint;

namespace sp_lend_id.taprat
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
            if (features[featureId] != null)
            {
                // The feature is already activated. No action required
                return null;
            }
            var type = typeof(SPFeatureCollection);

            // now we have to get "AddInternal" Method with this signature:
            //internal SPFeature AddInternal(Guid featureId, Version version, SPFeaturePropertyCollection properties, bool force, bool fMarkOnly, SPFeatureDefinitionScope featdefScope)

            var param = new[]
                            {
                                typeof (Guid), typeof (Version), typeof (SPFeaturePropertyCollection), typeof (bool),
                                typeof (bool), typeof (SPFeatureDefinitionScope)
                            };
            var addInternal = type.GetMethod("AddInternal", BindingFlags.Instance | BindingFlags.NonPublic, null, param, null);
            if (addInternal == null)
            {
                // faild to find the method
                return null;
            }
            var result = addInternal.Invoke(features, new object[] { featureId, null, properties, false, false, SPFeatureDefinitionScope.Farm });
            return result as SPFeature;
        }
    }
}
