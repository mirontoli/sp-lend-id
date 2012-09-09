/**
 * Creates an instance of CustomerViewModel.
 * 
 * @author Thorsten Hans
 * @constructor
 * @this {CustomerViewModel}
*/
function CustomerViewModel() {
	var self = this;
	
	self.allCustomers = ko.observableArray();
	
	/**
	* Initializes a new CustomerViewModel instance
	*
	* @param {array} customers An array containing customer model instances.
	*/
	self.init = function initCustomerViewModel(customers) {
		$.each(customers, function() {
			self.allCustomers.push(this);
		});
	};
}