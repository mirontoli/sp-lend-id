function CustomerModel(firstName, lastName, city) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.city = city;
}

CustomerModel.prototype = {
    getFullName: function() {
        return this.firstName + " " + this.lastName;
    }
};
// Node
if (typeof module !== 'undefined') {
    module.exports = CustomerModel;
}