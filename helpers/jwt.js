const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "rahasia";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

const getPayload = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, getPayload };
