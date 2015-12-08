using SPMeta2.Definitions;
using SPMeta2.Enumerations;
using System;

namespace kartta.Definitions.IA
{
    public class GoogleMapsFields
    {
        public static FieldDefinition LocationPoint = new FieldDefinition
        {
            FieldType = BuiltInFieldTypes.Text,
            Id = new Guid("6b616e0e-e75a-45bd-9fae-316075a4729d"),
            Title = "Location Point",
            InternalName = "LocationPoint",
            StaticName = "LocationPoint",
            Description = "Location Point",
            AddToDefaultView = true,
            Group = "kartta",
            JSLink = "~site/SiteAssets/kartta/googlemaps.jslink.js"
        };
        public static FieldDefinition LocationArea = new FieldDefinition
        {
            FieldType = BuiltInFieldTypes.Text,
            Id = new Guid("f3eb06a9-dfaf-4077-9e60-dcafc55db4f5"),
            Title = "Location Area",
            InternalName = "LocationArea",
            StaticName = "LocationArea",
            Description = "Location Area",
            AddToDefaultView = true,
            Group = "kartta",
            JSLink = "~site/SiteAssets/kartta/googlemaps.jslink.js"
        };
    }
}
