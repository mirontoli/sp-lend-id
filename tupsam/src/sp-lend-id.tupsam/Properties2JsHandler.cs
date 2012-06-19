using System.Collections;
using System.Linq;
using System.Web;
using Microsoft.SharePoint;

namespace sp_lend_id.tupsam
{
    public class Properties2JsHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }
        public void ProcessRequest(HttpContext context)
        {
            var js = GetJavascript(context.Request.Url.ToString());
            context.Response.ContentType = "application/x-javascript";
            context.Response.Write(js);
        }

        private static string GetJavascript(string url)
        {
            var json = string.Empty;
            var properties = GetProperties(url);
            if (properties != null)
            {
                var pairs =
                    (from DictionaryEntry prop in properties
                     select string.Format("\t\"{0}\" : \"{1}\"", prop.Key, prop.Value)).ToList();

                var s = string.Join(",\n", pairs.ToArray());
                json = string.Format("_webAppProperties = {{\n{0}\n}}", s);

            }
            return json;
        }

        private static Hashtable GetProperties(string url)
        {
            Hashtable properties = null;
            SPSecurity.RunWithElevatedPrivileges(() =>
                    {
                        using (var site = new SPSite(url))
                        {
                            var app = site.WebApplication;
                            properties = app.Properties;
                        }
                    });
            return properties;
        }
    }
}
