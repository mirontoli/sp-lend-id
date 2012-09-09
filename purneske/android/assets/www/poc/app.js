function onGetCustomersCompleted(customers) {
	var customerViewModel = new CustomerViewModel();
	customerViewModel.init(customers);
	ko.applyBindings(customerViewModel);
	$(".loadingMessage").hide();
	$("#customers").show();
}
function beforeLoadingCustomers() {
	$(".loadingMessage").show();
}
function initCustomersView() {
	CustomerRepository.getAllCustomers(beforeLoadingCustomers, onGetCustomersCompleted);
}
function getCustomers() {
	$.getJSON("http://www.abutaleb.se/TeamSite/_vti_bin/listdata.svc/MyContacts")
		.done(function(data) {
			console.log(data.d.results[0].FirstName);
		})
		.fail(function() {alert("failed");});
}

function testLogin() {
	var client = new SP.RestService("http://somethingonline.sharepoint.com/teamsite");
	client.signin("somethingonline@onmicrosoft.com", "P@ssw0rd", getCustomers);
}
$(function() {
	//initCustomersView();
	testLogin();
});