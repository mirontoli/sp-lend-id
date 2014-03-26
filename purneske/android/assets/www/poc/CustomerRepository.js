var CustomerRepository = {
	getAllCustomers: function(beforeComplete, onComplete) {
		beforeComplete();
		var customers = [];
	    $.ajax({
	        url: "http://abutaleb.se/teamsite/_vti_bin/listdata.svc/MyContacts",
	        dataType: 'json',
	        type:'GET',
	        //xhrFields: {
	        	//withCredentials:true
	        //},
	        success: function(data, textStatus, jqXHR) {
	        	var results = data.d.results,
	        		i = 0;
        		for (i; i < results.length; i++) {
        			customers.push(new CustomerModel(results[i].FirstName, results[i].LastName, results[i].WorkCity));
        		}
	            console.log(data.d.results[0].FirstName);
	            onComplete(customers);
	        },
	        error:function (jqXHR, textStatus, errorThrown){
	            alert("failed");
	        }
	    });

		
	}
};

