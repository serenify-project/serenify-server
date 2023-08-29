const { User } = require("../models");
const { getPayload } = require("../helpers/jwt");

const Authorization = async (req, res, next) => {
  try {
    if (!req.headers.access_token) {
      throw { name: "Unauthorized" };
    }

    const payload = getPayload(req.headers.access_token);

    if (payload.role !== "mentor") {
      throw { name: "Unauthorized" };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = Authorization;
