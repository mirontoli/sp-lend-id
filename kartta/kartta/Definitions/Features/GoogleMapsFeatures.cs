using SPMeta2.Definitions;
using SPMeta2.Enumerations;
using SPMeta2.Syntax.Default;

namespace kartta.Definitions.Features
{
    public class GoogleMapsFeatures
    {
        public static FeatureDefinition DisableMinimalDownloadStrategy = BuiltInWebFeatures.MinimalDownloadStrategy.Inherit(def =>
        {
            def.Enable = false;
        });
    }
}
