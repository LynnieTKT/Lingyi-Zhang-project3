const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

  console.log("Headers:", req.headers); // Debugging headers
  console.log("Cookies:", req.cookies); // Debugging cookies

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protect };
