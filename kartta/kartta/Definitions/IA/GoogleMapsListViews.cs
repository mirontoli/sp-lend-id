using SPMeta2.BuiltInDefinitions;
using SPMeta2.Definitions;
using SPMeta2.Enumerations;
using SPMeta2.Syntax.Default;
using System.Collections.ObjectModel;

namespace kartta.Definitions.IA
{
    public class GoogleMapsListViews
    {
        public static ListViewDefinition AllItems = BuiltInListViewDefinitions.Lists.AllItems.Inherit(listView => {
            listView.Fields = new Collection<string>
                {
                    BuiltInInternalFieldNames.LinkTitle,
                    GoogleMapsFields.LocationPoint.InternalName,
                    GoogleMapsFields.LocationArea.InternalName
                };
        });
    }
}
