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
	//CustomerRepository.getAllCustomers(beforeLoadingCustomers, onGetCustomersCompleted);
}

function testLogin() {
	var client = new SP.RestService("http://takana.sharepoint.com");
	client.signin("dev@takana.onmicrosoft.com", "fake-password", initCustomersView);
}
$(function() {
	//initCustomersView();
	testLogin();
});