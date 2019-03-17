// login rules
const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  // set up empty errors object. If an error occurs we will put it into the errors object
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : "";
  data.degree = !isEmpty(data.degree) ? data.degree : "";
  data.from = !isEmpty(data.from) ? data.from : "";
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";

  // If not valid, errors object will get filled and not be empty or valid, and return the errors
  // Validators

  if (Validator.isEmpty(data.school)) {
    errors.school = "School field is required.";
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = "Degree field is required.";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From Date field is required.";
  }
  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "Field of Study field is required.";
  }

  // If everything passes validation, the errors object will still be empty when getting passed through the isEmpty function, and there will be no errors.
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
