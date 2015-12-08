using SPMeta2.Definitions;
using SPMeta2.Enumerations;

namespace kartta.Definitions.IA
{
    public class GoogleMapsLists
    {
        public static ListDefinition Locations = new ListDefinition
        {
            Title = "Locations",
            CustomUrl = "Lists/Locations",
            TemplateType = BuiltInListTemplateTypeId.GenericList,
        };
    }
}
