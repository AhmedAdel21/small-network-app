const { hashPassword, comparePassword } = require("./auth-service");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("./token-service");
const User = require("../models/user-model");

const register = async (req, res) => {
  const { email, password } = req.body;

  if (await User.findOne({ email })) {
    return res.status(409).json({ message: "User already exists" });
  }

  const user = new User({
    email,
    password: await hashPassword(password),
    refreshToken: null,
  });
  try {
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  try {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findOne({ refreshToken: refreshToken }).select(
    "+refreshToken"
  );
  if (!user) return res.status(403).json({ message: "Forbidden" });

  try {
    verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(user);
    res
      .status(200)
      .json({ message: "Token refreshed", accessToken: newAccessToken });
  } catch {
    res.status(403).json({ message: "Forbidden" });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findOne({ refreshToken }).select("+refreshToken");
  if (!user) return res.status(403).json({ message: "Forbidden" });

  try {
    user.refreshToken = null;
    await user.save();
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Logout failed" });
  }
};

module.exports = { register, login, refresh, logout };