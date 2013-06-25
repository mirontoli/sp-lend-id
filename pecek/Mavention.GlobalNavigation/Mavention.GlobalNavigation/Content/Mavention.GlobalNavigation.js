function $_global_Mavention_GlobalNavigation_Some_Other_Stuff() {
	Function.registerNamespace('Mavention.GlobalNavigation');
	 
	Mavention.GlobalNavigation.MenuItem = function(title, url) {
		this.title = title;
		this.url = url;
	};
	 
	Mavention.GlobalNavigation.viewModel = {
		globalMenuItems: new Array()
	};
	 
	Mavention.GlobalNavigation.init = function(termStoreName, termSetId) {
		this.termStoreName = termStoreName;
		this.termSetId = termSetId;
		
		var suiteLinksBox = document.getElementById("suiteLinksBox");
		if (suiteLinksBox && suiteLinksBox.offsetHeight === 0 && suiteLinksBox.offsetWidth === 0) {
			//suiteLinksBox is hidden, no need to load any navigation items
			return;
		}
	 
		SP.SOD.executeOrDelayUntilScriptLoaded(Function.createDelegate(this, function() {
			'use strict';
			this.nid = SP.UI.Notify.addNotification("<img src='/_layouts/15/images/loadingcirclests16.gif?rev=23' style='vertical-align:bottom; display:inline-block; margin-" + (document.documentElement.dir == "rtl" ? "left" : "right") + ":2px;' />&nbsp;<span style='vertical-align:top;'>Loading navigation...</span>", false);
			SP.SOD.executeFunc("sp.js", "SP.Utilities.Utility", Function.createDelegate(this, function() {
				var taxonomySodLoaded = false;
	 
				if (typeof(_v_dictSod) !== 'undefined' &&
					_v_dictSod['sp.taxonomy.js'] == null) {
					SP.SOD.registerSod('sp.taxonomy.js', SP.Utilities.Utility.getLayoutsPageUrl('sp.taxonomy.debug.js'));
				}
				else {
					taxonomySodLoaded = _v_dictSod['sp.taxonomy.js'].state === Sods.loaded;
				}
				 
				if (taxonomySodLoaded) {
					Function.createDelegate(this, Mavention.GlobalNavigation.loadNavigationInternal)();
				}
				else {
					SP.SOD.executeFunc('sp.taxonomy.js', false, Function.createDelegate(this, Mavention.GlobalNavigation.loadNavigationInternal));
				}
			})); 

		}), 'core.js');
	};
	 
	Mavention.GlobalNavigation.loadNavigationInternal = function() {
		var context = SP.ClientContext.get_current();
		var taxonomySession = SP.Taxonomy.TaxonomySession.getTaxonomySession(context);
		var termStore = taxonomySession.get_termStores().getByName(this.termStoreName);
		var termSet = termStore.getTermSet(this.termSetId);
		var terms = termSet.getAllTerms();
		context.load(terms);
		context.executeQueryAsync(Function.createDelegate(this, function(sender, args) {
			var termsEnumerator = terms.getEnumerator();
			var menuItems = new Array();
			 
			while (termsEnumerator.moveNext()) {
				var currentTerm = termsEnumerator.get_current();
				Mavention.GlobalNavigation.viewModel.globalMenuItems.push(new Mavention.GlobalNavigation.MenuItem(currentTerm.get_name(), currentTerm.get_localCustomProperties()['_Sys_Nav_SimpleLinkUrl']));
			}
			 
			ko.applyBindings(Mavention.GlobalNavigation.viewModel);
			SP.UI.Notify.removeNotification(this.nid);
		}), Function.createDelegate(this, function(sender, args) {
			alert('The following error has occured while loading global navigation: ' + args.get_message());
		}));
	};
}
$_global_Mavention_GlobalNavigation_Some_Other_Stuff();
