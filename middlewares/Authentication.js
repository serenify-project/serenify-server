const { getPayload } = require("../helpers/jwt");
const { User } = require("../models");

async function Authentication(req, res, next) {
  try {
    const { access_token } = req.headers;

    // console.log(access_token, "<<< acess_token");

    if (!access_token) throw { name: "jwtNotFound" };

    const payload = getPayload(access_token);

    // console.log(payload, "<<< payload");

    if (!payload) throw { name: "JsonWebTokenError" };

    const user = await User.findOne({
      where: {
        email: payload.email,
      },
    });

    // console.log(user, "<< user");
    // console.log(user.id, "<< id");
    // console.log(user.email, "<< email");
    // console.log(user.role, "<< role");

    if (!user) throw { name: "NotFound" };

    req.additionalData = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    // console.log(req.additionalData, "<<< req aditional data");
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = Authentication;
