const { checkPassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");
const { User, Transaction, Package } = require("../models/");

class UserController {
  static async getUsers(req, res, next) {
    try {
      const data = await User.findAll();
      const users = data.map((user) => {
        const { id, username, email, birthDate, role, gender } = user;
        return { id, username, email, birthDate, role, gender };
      });
      res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const data = await User.findByPk(req.params.id);

      if (!data) {
        throw { name: 'NotFound' }
      }

      res.status(200).json({
        id: data.id,
        username: data.username,
        email: data.email,
        birthDate: data.birthDate,
        role: data.role,
        gender: data.gender,
      });
    } catch (err) {
      next(err);
    }
  }

  static async registerUser(req, res, next) {
    try {
      const { username, email, password, birthDate, gender, userFirebaseId } =
        req.body;

      const user = await User.create({
        username,
        email,
        password,
        role: "mentee",
        birthDate,
        gender,
        userFirebaseId,
      });

      res.status(201).json({
        id: user.id,
        email: user.email,
      });
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
        throw { name: "Invalid" };
      }
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
      if (checkPassword(password, user.password)) {
        res.status(200).json({
          statusCode: 200,
          access_token: token,
          id: user.id,
          email: user.email,
          role: user.role,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async editUser(req, res, next) {
    try {
      const { id } = req.params;
      const { username, email, birthDate, gender } = req.body;

      const editUser = await User.update(
        {
          username,
          email,
          birthDate,
          gender,
        },
        {
          where: {
            id,
          },
        },
      );

      if (!editUser) throw { name: "userEdit" };

      res.status(201).json({
        message: `User with id ${id} has been updated`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        throw { name: "NotFound" };
      }

      const deleteUser = await user.destroy({
        where: { id },
      });

      if (deleteUser) {
        res.status(201).json({
          statusCode: 201,
          message: `User with id ${id} has been deleted`,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async cekUserTransaction(req, res, next) {
    try {
      const { userId } = req.additionalData;
      console.log(userId, 11);
      // const data = await User.findByPk(userId, {});
      const data = await Transaction.findOne({
        where: {
          UserId: userId,
        },
        include: {
          model: Package,
        },
      });
      if (!data) {
        res.status(200).json(false);
        return;
      }

      const lastTransactionUser = data;
      // Get createdAt
      let today = new Date();
      let createdAt = lastTransactionUser.createdAt;

      // Calculate one month
      const oneMonth = new Date(createdAt);
      oneMonth.setMonth(createdAt.getMonth() + 1);

      // Calculate one year
      const oneYear = new Date(createdAt);
      oneYear.setFullYear(createdAt.getFullYear() + 1);
      console.log(oneMonth, 111);
      let enrollStatus = true;
      if (
        lastTransactionUser.Package.duration === "month" &&
        today > oneMonth
      ) {
        enrollStatus = false;
      } else if (
        lastTransactionUser.Package.duration === "year" &&
        today > oneYear
      ) {
        enrollStatus = false;
      }
      console.log(lastTransactionUser.Package.duration);
      res.status(200).json(enrollStatus);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
