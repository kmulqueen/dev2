// login rules
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
  // set up empty errors object. If an error occurs we will put it into the errors object
  let errors = {};

  data.text = !isEmpty(data.text) ? data.text : "";

  // If not valid, errors object will get filled and not be empty or valid, and return the errors
  // Validators

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters.";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required.";
  }

  // If everything passes validation, the errors object will still be empty when getting passed through the isEmpty function, and there will be no errors.
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
