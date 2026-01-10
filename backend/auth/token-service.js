const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });

const generateRefreshToken = (user) =>
  jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_SECRET);

const verifyRefreshToken = (token) =>
  jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };