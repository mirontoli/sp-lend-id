// function to process an accordion item..
window.COB = window.COB || {};
window.COB.accordionItem = {
    customItemHtml: function (ctx) {
        var accordionItemHtml = "<h3>" + ctx.CurrentItem.Title + "</h3>";
        accordionItemHtml += "<div>" + ctx.CurrentItem.AccordionItemDescription + "</div>";
        return accordionItemHtml;
    }
};

// anonymous self-executing function to setup JSLink templates on page load..
(function () {
    var overrideCtx = {};
    overrideCtx.Templates = {};

    overrideCtx.Templates.Header = "<div id=\"accordion\">";
    overrideCtx.Templates.Item = window.COB.accordionItem.customItemHtml;
    overrideCtx.Templates.Footer = "</div>";

    overrideCtx.BaseViewID = 1;
    overrideCtx.ListTemplateType = 11000;

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(overrideCtx);
})();

function onReady() {
    // It seems SharePoint inserts a script tag in an inconvenient place that breaks jQuery UI's accordion, so let's remove it! 
    // (N.B. further testing recommended for production)..
    $("#accordion").find('#scriptBodyWPQ2').remove();

    $("#accordion").width('70%');
    $("#accordion").accordion();
}

_spBodyOnLoadFunctionNames.push("onReady");
