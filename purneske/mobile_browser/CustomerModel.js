/**
  * Creates an instance of CustomerModel
  * @author Thorsten Hans
  * @constructor
  * @this {CustomerModel}
  * @param {string} firstName The Customer's firstName.
  * @param {string} lastName The Customer's lastName.
  * @param {string} city The Customer's city.
*/
function CustomerModel(firstName, lastName, city) {
	this.firstName = firstName;
	this.lastName = lastName;
	this.city = city;
}