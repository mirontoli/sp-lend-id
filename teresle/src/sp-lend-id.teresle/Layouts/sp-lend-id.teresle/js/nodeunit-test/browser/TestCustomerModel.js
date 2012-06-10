this.customer_model_test = {
    'format fullname': function (test) {
        test.expect(1);
        var customer = new CustomerModel("Konstantin", "Ivanov", "Slakbash");
        var fullName = customer.getFullName();
        test.equal(fullName, "Konstantin Ivanov", "Fullname = firstname lastname");
        test.done();
    }
};
