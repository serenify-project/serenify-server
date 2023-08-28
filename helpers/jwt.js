const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "Cookiemonsta";

const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET);
};

const getPayload = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

module.exports = { generateToken, getPayload };
