/*
 * sp-export-webpart.js
 * by @mirontoli (https://github.com/mirontoli)
 * License: MIT
 * Info about REST API User Custom Actions in SharePoint:
 * https://msdn.microsoft.com/en-us/library/office/dn531432.aspx
*/
"use strict";
window.spUserCustomActions = {};
window.spUserCustomActions.init = function() {
	/*
	if (!window._) {
		var script = document.createElement("script");
		script.setAttribute("type","text/javascript");
		script.setAttribute("src","//cdnjs.cloudflare.com/ajax/libs/lodash.js/4.6.1/lodash.min.js");
		var head = document.getElementsByTagName('head')[0];
		head.appendChild(script);
	}*/
	function getAllUserCustomActions(success, error) {
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var endpoint = webUrl + '/_api/site/userCustomActions';
		SP.SOD.registerSod('sp.requestexecutor.js', webUrl + '/_layouts/15/sp.requestexecutor.js');
        SP.SOD.executeFunc('sp.requestexecutor.js', 'SP.RequestExecutor', function () {
            var executor = new SP.RequestExecutor(webUrl);
            executor.executeAsync({
                    url: endpoint,
                    method: 'GET',
                    headers: { 'Accept': 'application/json; odata=verbose',  "content-type": "application/json; odata=verbose"},
                    success: function(response) {
                    	var data = JSON.parse(response.body);
                    	success && success(data.d.results);
                    	window.tolle = data;
                    	console.log(data);
                    },
                    error: error
                }
            );
        });
	}
	function getUserCustomActionsAsHtml(results) {
		var html = results.map(function(r) {
			var label = r.ScriptSrc ? "ScriptSrc" : "ScriptBlock";
			var info = ['<div class="actionDetails"><table>'];
			for (var p in r) {
				if (r.hasOwnProperty(p)) {
					info.push(['<tr><th>',p, '</th><td>', r[p], '</tr>'].join(''));
				}
			}
			info.push('</table></div>');
			return ['<div class="actionRow"><label onclick="spUserCustomActions.toggleDetails(this)">', label, '</label><input type="text" value="', r.ScriptSrc || r.ScriptBlock, '"><a href="javascript:spUserCustomActions.deleteUserCustomAction(\'' + r.Id + '\');">&#x2716;</a>', ' (', r.Name, ': ', r.Title, ') ', info.join(''),'</div>' ].join('');
		});
		return html.join('');
	}
	spUserCustomActions.toggleDetails = function(lbl) {
		var pn = lbl.parentNode;
		var details = pn.querySelector('.actionDetails');
		if (details.clientHeight) { details.style.height = 0; } else { details.style.height = details.scrollHeight+'px'; }
		pn.className = (pn.className == "actionRow") ? "actionRow checked" : "actionRow";
	}

	spUserCustomActions.deleteUserCustomAction = function(actionId) {
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var endpoint = webUrl + "/_api/site/userCustomActions('" + actionId + "')";
		var executor = new SP.RequestExecutor(webUrl);
		executor.executeAsync({
		  url: endpoint,
		  method: "POST",
		  headers: { "X-HTTP-Method": "DELETE" },
		  success: function(response) {
				debugger;
			},
		  error: function() {debugger;console.log('nope', arguments); }
		});
	}
	spUserCustomActions.submitUserCustomAction = function() {
		var textarea = document.getElementById("new-uca");
		var scriptBlock = textarea.value;
		console.log(scriptBlock);
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var endpoint = webUrl + '/_api/site/userCustomActions';
		var executor = new SP.RequestExecutor(webUrl);
		executor.executeAsync({
  			url: endpoint,
  			method: "POST",
  			body: "{ '__metadata': { 'type': 'SP.UserCustomAction' }, 'Location':'ScriptLink', 'Sequence':'101', 'Title':'Open Shared Docs','Description':'', ScriptBlock: '" + scriptBlock + "' }",
		  	headers: {
		    	"accept": "application/json; odata=verbose",
		    	"content-type": "application/json; odata=verbose"
	  		},
		  success: function() { console.log('submitted', arguments); },
		  error: function() {console.log('nope', arguments); }
		});
	};
	spUserCustomActions.submitSiteAction = function() {
		var titleInput = document.getElementById("new-siteaction-title");
		var urlInput = document.getElementById("new-siteaction-url");
		var title = titleInput.value;
		var url = urlInput.value;
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var endpoint = webUrl + '/_api/site/userCustomActions';
		var executor = new SP.RequestExecutor(webUrl);
		executor.executeAsync({
  			url: endpoint,
  			method: "POST",
  			body: "{ '__metadata': { 'type': 'SP.UserCustomAction' }, 'Location':'Microsoft.SharePoint.StandardMenu', 'Group':'SiteActions', 'Sequence':'101', 'Title':'"
  				+ title + "', 'Description':'Added by javascript', 'Url':'" + url
  				+ "' }",
		  	headers: {
		    	"accept": "application/json; odata=verbose",
		    	"content-type": "application/json; odata=verbose"
	  		},
		  success: function() { console.log('submitted site action', title, url, arguments); },
		  error: function() {console.log('site action submission failed', arguments); }
		});
	};
	function getHtml(results) {
		var style = ['<style type="text/css">',
		'.actionRow > label::before {content: "+";display: inline-block;width:1em;line-height:1em;margin-right: 3px; background-color: #ccc; border-radius: 10px; text-align: center;}',
		'.actionDetails { overflow: hidden; transition: height .5s; height: 0; box-sizing: border-box; }',
		'.actionDetails table { margin: 5px; border-collapse: collapse; }',
		'.actionDetails table td, .actionDetails table th { vertical-align: top; border: 1px solid #ccc; text-align: left; }',
		'.actionRow.checked > label::before {content: "-";}',
		'</style>'].join('');
		var explanation = ['<div>Please click on the link for you web part to see all user custom actions</div>',
			'<div>The tool is provided as is. Author: Anatoly Mironov @mirontoli, 2016-03-17. See the details on my blog: <a href="http://chuvash.eu">See all User Custom Actions</a></div><h3>Site User Custom Actions</h3>'
			].join('');
		var newUserCustomAction = ['<div>Add new user custom action ScriptBlock. You can also load scripts and css in this scriptblock.<br>',
			'<textarea id="new-uca" style="width:100%;box-sizing:border-box;min-height: 50px;"></textarea><br><input type="button" value="Add new" onclick="spUserCustomActions.submitUserCustomAction()"></div>'].join('');
		var newSiteAction = ['<div>Add new site action (title and url). For example: Documents - ~site/Shared%20Documents/Forms/AllItems.aspx<br>',
			'Title: <input type="text" id="new-siteaction-title">Url: <input type="text" id="new-siteaction-url"><input type="button" value="Add new" onclick="spUserCustomActions.submitSiteAction()"></div>']
		return [style,explanation, getUserCustomActionsAsHtml(results), newUserCustomAction, newSiteAction].join('');
	}

	function showDialog(results) {
		var html = document.createElement('div');
		html.innerHTML = getHtml(results);
		OpenPopUpPageWithDialogOptions({
		 title: "Administer User Custom Actions",
		 html:html,
		 allowMaximize: true,
		 showClose: true,
		 autoSize: true,
		});
	}
	function commonError() {
		console.log('error.arguments', arguments);
	}
	function renderDialog() {
		getAllUserCustomActions(showDialog, commonError);
	}
	renderDialog();
};
window.spUserCustomActions.init();
