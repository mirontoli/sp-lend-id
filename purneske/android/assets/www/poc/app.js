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
    $.ajax({
        url: "http://somethingonline.sharepoint.com/teamsite/_vti_bin/listdata.svc/MyContacts",
        dataType: 'json',
        type:'GET',
        xhrFields: {
        	withCredentials:true
        },
        success: function(data, textStatus, jqXHR) {
            console.log(data.d.results[0].FirstName);
        },
        error:function (jqXHR, textStatus, errorThrown){
            alert("failed");
        }
    });
}

function testLogin() {
	var client = new SP.RestService("http://somethingonline.sharepoint.com/teamsite");
	client.signin("somethingonline@onmicrosoft.com", "P@ssw0rd", getCustomers);
}
$(function() {
	//initCustomersView();
	testLogin();
});