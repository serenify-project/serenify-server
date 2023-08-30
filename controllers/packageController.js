const { Package, User } = require("../models");
class PackageController {
  static async getAllPackages(req, res, next) {
    try {
      const result = await Package.findAll({});

      if (result.length === 0) throw { name: "NotFound" };

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
  static async getPackageById(req, res, next) {
    try {
      const { id } = req.params;

      const result = await Package.findOne({
        where: {
          id,
        },
      });

      if (!result) throw { name: "NotFound" };

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async addNewPackage(req, res, next) {
    try {
      const { name, description, price, duration } = req.body;

      const created = await Package.create({
        name,
        description,
        price,
        duration,
      });

      res.status(201).json({
        message: created,
      });
    } catch (err) {
      next(err);
    }
  }

  static async editPackage(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, price, duration } = req.body;

      const result = await Package.findOne({
        where: {
          id,
        },
      });

      if (!result) throw { name: "NotFound" };

      await result.update(
        {
          name,
          description,
          price,
          duration,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(201).json({
        message: `Data with id ${id} has been updated`,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deletePackage(req, res, next) {
    try {
      const { id } = req.params;

      const result = await Package.findOne({
        where: {
          id,
        },
      });

      console.log(result);

      const destroyed = await Package.destroy({ where: { id } });

      if (!destroyed) throw { name: "ErrorDelete" };

      res.status(201).json({
        message: `Package with id ${result.dataValues.id} has been deleted`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PackageController;