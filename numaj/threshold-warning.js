(function(){
	'use strict';
	//todo cache
	var request = function(endpoint, success) {
		var sodKey = 'sp.requestexecutor.js';
		if(!_v_dictSod[sodKey]) {
			SP.SOD.registerSod(sodKey, 
				_spPageContextInfo.webAbsoluteUrl 
				+ '/_layouts/15/sp.requestexecutor.js');
		}
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
        SP.SOD.executeFunc(sodKey, 'SP.RequestExecutor', function () {
            var executor = new SP.RequestExecutor(webUrl);
            executor.executeAsync({
                    url: endpoint,
                    method: 'GET',
                    headers: { 'Accept': 'application/json; odata=verbose',  "content-type": "application/json; odata=verbose"},                    
                    success: function(response) { 
                    	success && success(response);
                    },
                    error: function(){ console.log("error");}
                }
            );
        });
	};
	var userCanManageList = function(listId, success) {
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var endpoint = [webUrl,
				"/_api/web/Lists/GetById('", listId,
				"')/EffectiveBasePermissions"].join('');	
		request(endpoint, function(response) {
			var data = undefined;
			try {
			    data = JSON.parse(response.body);
			}
			catch(err) {
			    
			}
			if(!data) {
				success && success(false);
			}
//http://sharepoint.stackexchange.com/questions/77374/how-do-i-query-of-the-current-user-permissions-using-rest-call-on-doesuserhavepe

        	var manageListsPerms = new SP.BasePermissions();
        	manageListsPerms.initPropertiesFromJson(data.d.EffectiveBasePermissions);

        	var manageLists = manageListsPerms.has(SP.PermissionKind.manageLists);
        	success(manageLists);
		});

		
	};
	var showWarning = function(count) {
		var html = document.createElement('div');
		html.innerHTML = "your list/library exceeds list view threshold. There are " + count + " items." 
		+ "<div>Some additional info and reference to Good Practices and Governance<br></div>"
		+ '<div><input type="checkbox">Hide this message for a week</div>';
		OpenPopUpPageWithDialogOptions({
		 title: "List View Threshold Warning",
		 html:html,
		 allowMaximized: true,
		 showClose: true,
		 autoSize: true,
		});
	};
	var itemCount = function(listId, success) {
		var webUrl = _spPageContextInfo.webAbsoluteUrl;
		var endpoint = [webUrl,
				"/_api/web/Lists/GetById('", listId,
				"')/ItemCount"].join('');
		request(endpoint, function(response) {
			var data = undefined;
			try {
			    data = JSON.parse(response.body);
			}
			catch(err) {
			    
			}

			if(data) {
				console.log(data.d.ItemCount);
				success && success(data.d.ItemCount);
			}
		});
	};
	var warnIfNeeded = function() {
		//just a sanity check
		if (!SP.ListOperation.Selection) { 
			return;
		}
		var listId = SP.ListOperation.Selection.getSelectedList();
		if (!listId) {
			return;
		}
		userCanManageList(listId, function success(hasRight) {
			if(hasRight) {
				itemCount(listId, function(count) {
					if(count > 5000) {
						showWarning(count);
					}
				});
			}
		});	
	};
	var init = function(){
		//wait three minutes, 
		//think if someone just wants to grab a file quickly
		var timeout = 1000; //1000*60*3
		window.setTimeout(warnIfNeeded, timeout);
	};
	init();
})();