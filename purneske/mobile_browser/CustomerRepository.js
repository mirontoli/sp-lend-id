var CustomerRepository = {
	/*
	* @author Thorsten Hans
	* getAllCustomers will load all contacts from SharePOint
	*
	* @param {object} beforeComplete Method will be executed before SPServices call
	* @param {object} onComplete will be invoked when results are built. 
	* An array of CustomerModel instances is passed
	*/
	getAllCustomers: function(beforeComplete, onComplete) {
		var options = {
			operation: "GetListItems",
			async: true,
			listName: "MyContacts",
			CAMLViewFields: "<ViewFields> \
								<FieldRef Name='Title'/> \
								<FieldRef Name='FirstName'/> \
								<FieldRef Name='WorkCity'/> \
							</ViewFields>",
			completefunc: function(xData, status) {
				var customers = new Array();
				$(xData.responseXML).SPFilterNode("z:row").each(function() {
					var item = $(this);
					customers.push(new CustomerModel(item.attr("ows_FirstName"),
					                                 item.attr("ows_Title"),
													 item.attr("ows_WorkCity")));
				});
				onComplete(customers);
			}
		};
		beforeComplete();
		$().SPServices(options);
	}
};