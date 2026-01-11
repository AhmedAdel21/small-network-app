const { verifyAccessToken } = require("../auth/token-service");

module.exports = (req, res, next) => {
  try {
    console.log("checkAuth middleware");
    const token = req.headers.authorization?.split(" ")[1];
    console.log("token found", token);
    if (!token) {
      return res.sendStatus(401);
    }
    console.log("verifying token");
    req.user = verifyAccessToken(token);
    console.log("user verified", req.user);
    next();
  } catch {
    res.sendStatus(403);
  }
};
