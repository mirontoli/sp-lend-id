namespace sp_lend_id.talmac.Layouts.sp_lend_id.talmac
{
    using System;
    using Microsoft.SharePoint.WebControls;
    using Utilities.Resources;

    public partial class Sample : LayoutsPageBase
    {
        protected void Page_Load(object sender, EventArgs e)
        {

            Image1.ImageUrl = ResourceUtility.GenerateHandlerUrl(TextBoxUrl.Text);
            LiteralTransformedUrl.Text = Image1.ImageUrl;
        }


    }
}
