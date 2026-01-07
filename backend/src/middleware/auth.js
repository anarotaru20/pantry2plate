const { verifyJwt } = require("../config/jwt");
const { logger } = require("../config/logger");

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const parts = header.split(" ");
  const type = parts[0];
  const token = parts[1];

  if (type !== "Bearer" || !token) {
    logger.warn("Authorization header missing or malformed");
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    logger.warn("Invalid JWT token");
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = requireAuth;