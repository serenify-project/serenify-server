const { getPayload } = require("../helpers/jwt");

const Authorization = async (req, res, next) => {
  try {
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