const { body } = require("express-validator");

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Invalid credentials address"),
  body("password").exists().withMessage("Invalid credentials password"),
];
