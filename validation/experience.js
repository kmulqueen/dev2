// login rules
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  // set up empty errors object. If an error occurs we will put it into the errors object
  let errors = {};

  // Required fields
  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // If not valid, errors object will get filled and not be empty or valid, and return the errors
  // Validators

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required.";
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required.";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From Date field is required.";
  }

  // If everything passes validation, the errors object will still be empty when getting passed through the isEmpty function, and there will be no errors.
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
