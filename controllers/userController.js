const { checkPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User } = require("../models/");

class userController {
  static async registerUser(req, res, next) {
    try {
      const { username, email, password, role, birthDate, gender } = req.body;

      const user = await User.create({
        username,
        email,
        password,
        role,
        birthDate,
        gender,
      });

      res.status(201).json({ id: user.id, email: user.email });
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({
        where: {
          email,
        },
      });
      if (!user) {
        throw { name: "InvalidCredentials" };
      }
      const token = generateToken({
        id: user.id,
        email: user.email,
      });
      if (checkPassword(password, user.password)) {
        res.status(200).json({
          statusCode: 200,
          access_token: token,
          email: user.email,
          role: user.role,
        });
      } else {
        throw { name: "InvalidCredentials" };
      }
    } catch (error) {
      next(error);
    }
  }

  static async editUser(req, res, next) {
    try {
      // console.log("controller edit hitted <<<<<,");
      const { userId } = req.additionalData;
      const { username, email, password, role, birthDate, gender } = req.body;

      // console.log(username, email, password, role, birthDate, gender, "<<<");

      const user = await User.findByPk(userId);

      // console.log(user, "<<< user di controller edit");

      if (!user) {
        throw { name: "NotFound" };
      }

      const updatedUserData = {
        username,
        email,
        password: generateToken(password), // Hash the new password
        role,
        birthDate,
        gender,
      };

      console.log(updatedUserData, "<<< data yang mau di update");

      await user.update(updatedUserData);

      res.status(200).json({ message: "User data updated successfully", user });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      // console.log("delete user controler has been hitted");
      const { userId } = req.additionalData;

      // console.log(userId, "<<");

      const user = await User.findByPk(userId);

      // console.log(user, "<<<");

      if (!user) {
        throw { name: "NotFound" };
      }

      const deleteUser = await user.destroy({
        where: { userId: id },
      });

      if (deleteUser) {
        res.status(200).json({
          statusCode: 200,
          message: "Your account has been deleted",
        });
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = userController;
