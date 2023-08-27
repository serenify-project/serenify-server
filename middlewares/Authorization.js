const { User } = require("../models");
const { getPayload } = require("../helpers/jwt");

const authorization = async (req, res, next) => {
  try {
    console.log(req.headers.access_token, "<< masuk sini");
    if (!req.headers.access_token) {
      throw { name: "Unauthorized" };
    }

    const payload = getPayload(req.headers.access_token);
    console.log(payload, "<<< ini payload");

    if (payload.role !== "mentor") {
      throw { name: "Unauthorized" };
    } else {
      next();
    }
    // console.log (user.role)
  } catch (err) {
    // console.log(err)
    // console.log(err, 'disini errornya')
    next(err);
  }
};

module.exports = authorization;
