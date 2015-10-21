/*
 * sp-export-webpart.js
 * by @mirontoli (https://github.com/mirontoli)
 * License: MIT
*/
"use strict";
window.spExportWebPart = {};
window.spExportWebPart.init = function() {
	var webparts = [];
	var getCommonUrlPart = (function() {
		var commonUrlPart = undefined;
		function assembleCommonUrlPart() {
			return [_spPageContextInfo.webAbsoluteUrl, '/_vti_bin/exportwp.aspx?pageurl='
				, window.location.protocol, '//', window.location.host
				, _spPageContextInfo.serverRequestPath,  '&guidstring='].join('');
		}
		return function() {
			commonUrlPart = commonUrlPart || assembleCommonUrlPart();
			return commonUrlPart;
		}
	})();
	function getAllWebParts(success, error) {
	    var ctx = SP.ClientContext.get_current()
	    var oFile = ctx.get_web().getFileByServerRelativeUrl(_spPageContextInfo.serverRequestPath);
	    var limitedWebPartManager = oFile.getLimitedWebPartManager(SP.WebParts.PersonalizationScope.shared);
	    var webPartDefs = limitedWebPartManager.get_webParts();
	    ctx.load(webPartDefs,'Include(Id, WebPart)');
		ctx.executeQueryAsync(
		  function () {
		    for(var i = 0;i < webPartDefs.get_count();i++) {
		       var webPartDef = webPartDefs.getItemAtIndex(i);
		       if (webPartDef.get_id() !== SP.Guid.get_empty().toString()) {
   		       	 var webPart = webPartDef.get_webPart();
		       	 webparts.push({id:webPartDef.get_id(), title: webPart.get_title()});
		       }
		    }
		    success();
		  },
		  function(sender,args){
		     error && error();
		  });
	}
	function getWebPartsAsHtml() {
		var webpartsAsHtml = webparts.map(function(w) { 
			var url = getCommonUrlPart() + w.id;
			return ['<li><a href="', url, '">', w.title, '</a></li>' ].join(''); 
		});
		return webpartsAsHtml.join('');
	}
	function getHtml() {
		var explanation = ['<div>Please click on the link for you web part to export the webpart</div>',
			'<div>In future I will try to provide a better interface for selecting your webpart</div>',
			'<div>The tool is provided as is. Author: Anatoly Mironov @mirontoli, 2015-10-21. See the details on my blog: <a href="http://chuvash.eu">Export Any WebPart using a bookmarklet</a></div>'
			].join('');
		return [explanation, '<ul>', getWebPartsAsHtml(), '</ul>'].join('');
	}

	function showDialog() {
		var html = document.createElement('div');
		html.innerHTML = getHtml();
		OpenPopUpPageWithDialogOptions({
		 title: "Export Web Part",
		 html:html,
		 allowMaximized: true,
		 showClose: true,
		 autoSize: true,
		});
	}
	function commonError() {
		alert("Well, something went wrong");
	}
	function renderDialog() {
		getAllWebParts(showDialog, commonError);
	}
	renderDialog();
};
window.spExportWebPart.init();

