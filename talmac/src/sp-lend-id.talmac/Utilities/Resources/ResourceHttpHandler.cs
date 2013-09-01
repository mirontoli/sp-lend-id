namespace sp_lend_id.talmac.Utilities.Resources
{
    using System.Web;

    public class ResourceHttpHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get { return true; }
        }
        public void ProcessRequest(HttpContext context)
        {
            //Uri.OriginalString to avoid automatic decoding: http://msdn.microsoft.com/en-us/library/system.uri.tostring.aspx
            var resource = ResourceUtility.GetResource(context.Request.Url.OriginalString);
            context.Response.ContentType = resource.ContentType;
            //context.Response.AddHeader("Content-Disposition", "inline; filename=");
            context.Response.BinaryWrite(resource.Content);
            context.Response.End();
        }
    }
}
