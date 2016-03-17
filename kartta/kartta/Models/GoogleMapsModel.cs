using kartta.Consts;
using kartta.Definitions.Features;
using kartta.Definitions.IA;
using SPMeta2.BuiltInDefinitions;
using SPMeta2.Models;
using SPMeta2.Syntax.Default;
using SPMeta2.Syntax.Default.Utils;
using System.IO;

namespace kartta.Models
{
    public class GoogleMapsModel
    {

        public static ModelNode GetModel()
        {
            var model = SPMeta2Model.NewWebModel(web => {
                web
                    .AddWebFeature(GoogleMapsFeatures.DisableMinimalDownloadStrategy)
                    .AddField(GoogleMapsFields.LocationPoint)
                    .AddField(GoogleMapsFields.LocationArea)
                    .AddList(GoogleMapsLists.Locations, list => {
                        list
                            .AddField(GoogleMapsFields.LocationPoint)
                            .AddField(GoogleMapsFields.LocationArea)
                            .AddListView(GoogleMapsListViews.AllItems);
                    })
                    .AddHostList(BuiltInListDefinitions.SiteAssets, list =>
                    {
                        if (Directory.Exists(GoogleMapsConsts.SiteAssetsPath))
                        {
                            ModuleFileUtils.LoadModuleFilesFromLocalFolder(list, 
                                GoogleMapsConsts.SiteAssetsPath);
                        }
                    });
            });
            return model;
        }
    }
}
