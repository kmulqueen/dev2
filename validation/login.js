// login rules
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  // set up empty errors object. If an error occurs we will put it into the errors object
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // If not valid, errors object will get filled and not be empty or valid, and return the errors
  // Validators
  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid.";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required.";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required.";
  }

  // If everything passes validation, the errors object will still be empty when getting passed through the isEmpty function, and there will be no errors.
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
