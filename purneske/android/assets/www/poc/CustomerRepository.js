var CustomerRepository = {
	getAllCustomers: function(beforeComplete, onComplete) {
		beforeComplete();
		var customers = [];
		customers.push(new CustomerModel("Tolle", "Olle", "Ulan Bator"));
		customers.push(new CustomerModel("Molle", "SOlle", "Peking"));
		onComplete(customers);
	}
};
