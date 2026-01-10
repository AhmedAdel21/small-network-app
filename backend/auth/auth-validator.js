const { body } = require("express-validator");

const registerValidator = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const loginValidator = [
  body("email").isEmail().withMessage("Invalid credentials address"),
  body("password").exists().withMessage("Invalid credentials password"),
];

module.exports = { registerValidator, loginValidator };