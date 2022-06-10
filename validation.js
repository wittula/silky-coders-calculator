const { check } = require("express-validator");

exports.inputValidation = [
  check("value", "Value must be a number!").exists().isNumeric(),
  check("tempTo", "Selected temperature units can't be the same!").custom(
    (value, { req }) => value != req.body.tempFrom
  ),
];
