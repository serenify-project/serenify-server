const { getPayload } = require("../helpers/jwt");
const { User } = require("../models");

async function Authentication(req, res, next) {
  try {
    const { access_token } = req.headers;

    if (!access_token) throw { name: "jwtNotFound" };

    const payload = getPayload(access_token);

    const user = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    req.additionalData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = Authentication;