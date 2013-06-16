
// function to setup JSLink templates
function registerAccordion() {
    // function to process an accordion item..
    window.COB = window.COB || {};
    window.COB.accordionItem = {
        customItemHtml: function (ctx) {
            var accordionItemHtml = "<h3>" + ctx.CurrentItem.Title + "</h3>";
            accordionItemHtml += "<div>" + ctx.CurrentItem.AccordionItemDescription + "</div>";
            return accordionItemHtml;
        }
    };

    var overrideCtx = {};
    overrideCtx.Templates = {};

    overrideCtx.Templates.Header = "<div id=\"accordion\">";
    overrideCtx.Templates.Item = window.COB.accordionItem.customItemHtml;
    overrideCtx.Templates.Footer = "</div>";

    overrideCtx.BaseViewID = 1;
    overrideCtx.ListTemplateType = 11000;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);

    $(document).ready(function () {
        // It seems SharePoint inserts a script tag in an inconvenient place that breaks jQuery UI's accordion, so let's remove it! 
        // (N.B. further testing recommended for production)..
        $("#accordion").find('#scriptBodyWPQ2').remove();

        $("#accordion").width('70%');
        $("#accordion").accordion();
    });

}





//CSR-override for MDS disabled site (because we need to call the entry point function in this case whereas it is not needed for anonymous functions)
registerAccordion();

// http://blogs.msdn.com/b/sridhara/archive/2013/02/08/register-csr-override-on-mds-enabled-sharepoint-2013-site.aspx
// CSR-override for MDS enabled site
RegisterModuleInit("/SiteAssets/AccordionListView.js", registerAccordion);
