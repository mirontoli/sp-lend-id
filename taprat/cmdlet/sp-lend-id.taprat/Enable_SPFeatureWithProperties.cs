using System;
using System.Collections.Generic;
using Microsoft.SharePoint;

namespace sp_lend_id.taprat
{
    [System.Management.Automation.Cmdlet(System.Management.Automation.VerbsLifecycle.Enable, "SPFeatureWithProperties")]
    public class Enable_SPFeatureWithProperties : System.Management.Automation.PSCmdlet
    {
        /// <summary>
        /// Id for the feature
        /// For now only guid supported
        /// </summary>
        /// todo add support for name
        [System.Management.Automation.Parameter(Position = 0, Mandatory = true)] 
        public string Identity;
        
        [System.Management.Automation.Parameter(Position = 1, Mandatory = true)]
        public string Url;

        [System.Management.Automation.Parameter(Position = 2, Mandatory = false)]
        public System.Collections.Hashtable Properties; 

        protected override void ProcessRecord()
        {
            var properties = GetProperties();
            WriteObject(properties);
            using (var site = new SPSite(Url))
            {
                using (var web = site.OpenWeb())
                {
                    var features = web.Features;
                    var id = new Guid(Identity);
                    features.ActivateFeature(id, properties);
                }
            }
        }
        /// <summary>
        /// Converts hashtable to dictionary
        /// http://stackoverflow.com/questions/6455822/convert-hashtable-to-dictionary-in-c-sharp/6455939#6455939
        /// no error handling for now
        /// </summary>
        /// <returns></returns>
        private Dictionary<string, string> GetProperties()
        {
            var dictionary = new Dictionary<string, string>();
            if (Properties != null)
            {
                foreach (var key in Properties.Keys)
                {
                    dictionary.Add((string)key, (string)Properties[key]);
                }
            }
            return dictionary;
        }
    }
}
