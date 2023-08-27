const { Package, User } = require("../models");
class PackageController {
  static async getAllPackages(req, res, next) {
    try {
      const result = await Package.findAll({});

      if (!result) throw { name: "Data not found" };

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
      const { name, description, price, duration, schedule } = req.body;

      const created = await Package.create({
        name,
        description,
        price,
        duration,
        schedule,
      });

      if (!created) throw { name: "ErrorData" };

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
      const { name, description, price, duration, schedule } = req.body;

      console.log(name, description, price, duration, schedule, "<<");

      const editPackage = await Package.update(
        {
          name,
          description,
          price,
          duration,
          schedule,
        },
        {
          where: {
            id,
          },
        },
      );

      if (!editPackage) throw { name: "ErrorEdit" };

      res.status(201).json({
        message: `Data with id ${id} has been updated`,
      });
    } catch (error) {
      console.log(error);
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

      res.status(200).json({
        message: `${result.dataValues.name} success to delete`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PackageController;
