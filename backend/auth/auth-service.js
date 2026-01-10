const bcrypt = require("bcryptjs");

const saltRounds = 12;

const hashPassword = async (password) =>
  await bcrypt.hash(password, saltRounds);

const comparePassword = async (password, hash) =>
  await bcrypt.compare(password, hash);

module.exports = { hashPassword, comparePassword };
