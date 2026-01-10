const express = require("express");
const { register, login, refresh, logout } = require("./auth-controller");
const { authenticate } = require("./auth-middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", authenticate, (req, res) => {
  res.json(req.user);
});

module.exports = router;
