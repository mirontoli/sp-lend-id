/**
 * Runs the app.
 * 
 * @author Thorsten Hans
 * @constructor
 * @this {CustomerViewModel}
*/
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
	console.log("initCustomerView");
	beforeLoadingCustomers();
	CustomerRepository.getAllCustomers(beforeLoadingCustomers, onGetCustomersCompleted);
}

$(function() {
	initCustomersView();
});