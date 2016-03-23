using System.Collections.Generic;
using System.Globalization;
using System.Text.RegularExpressions;
using System.Web;
using System.Xml;
using Microsoft.SharePoint;
using Microsoft.SharePoint.Utilities;

namespace sp_lend_id.jerkelle
{
    public class Resx2JsHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return false; }
        }
        public void ProcessRequest(HttpContext context)
        {
            var res = context.Request.QueryString["res"];
            var js = GetJavascript(res);
            context.Response.ContentType = "application/x-javascript";
            context.Response.Write(js);
        }

        private static string GetJavascript(string res)
        {
            var result = string.Empty;
            if (res == null)
            {
                return result;
            }
            var ci = SPContext.Current != null
                            ? new CultureInfo((int)SPContext.Current.Web.Language)
                            : CultureInfo.CurrentCulture;
            var name = ci.Name;
            var fileName = string.Format("\\Resources\\{0}.{1}.resx", res, name);
            var path = SPUtility.GetGenericSetupPath(fileName);
            var text = GetContent(path);
            var json = ConvertToJson(text);
            result = string.Format("{0} = {1};\n", res, json);
            return result;
        }

        private static string ConvertToJson(string text)
        {
            var json = string.Empty;

            var doc = new XmlDocument();
            doc.LoadXml(text);
            var elements = doc.SelectNodes("/root/data");
            if (elements == null)
            {
                return json;
            }
            var pairs = new List<string>();
            foreach (XmlNode e in elements)
            {
                var name = e.Attributes[0].Value;
                var value = e.FirstChild.InnerText.Trim().Replace("\"", "'");
                value = Regex.Replace(value, "\r?\n", "");
                var pair = string.Format("\t\"{0}\" : \"{1}\"", name, value);
                pairs.Add(pair);
            }
            var s = string.Join(",\n", pairs.ToArray());
            json = string.Format("{{\n{0}}}", s);
            return json;
        }

        private static string GetContent(string path)
        {
            var content = string.Empty;
            SPSecurity.RunWithElevatedPrivileges(() =>
            {
                content = System.IO.File.ReadAllText(path);
            });
            return content;
        }
    }
}
