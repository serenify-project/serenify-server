const { Package, User } = require("../models");
class packageController {
  static async getAllPackages(req, res, next) {
    try {
      // console.log("masuk pangil semua package");

      const result = await Package.findAll({
        //   include: {
        //     model: User,
        //   },
      });

      if (!result) throw { name: "Data not found" };

      // console.log(req.additionalData.userId);

      // console.log(result, "<<<<<< ini result");

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

      console.log(name, description, price, duration, schedule, "<<<< 42");

      // const authorId = req.additionalData.userId;

      // console.log(authorId);
      const created = await Package.create({
        name,
        description,
        price,
        duration,
        schedule,
        //   authorId,
        //   categoryId: +categoryId,
      });

      if (!created) throw { name: "ErrorData" };

      // await History.create({
      //   name,
      //   description: `Package with name ${name} has been created`,
      //   updatedBy: req.additionalData.email,
      // });

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
        }
      );

      if (!editPackage) throw { name: "ErrorEdit" };

      // await History.create({
      //   name,
      //   description: `Package with id ${id} updated`,
      //   updatedBy: req.additionalData.email,
      //   // req.additionalData.email
      // });

      res.status(201).json({
        message: `Data with id ${id} has been updated`,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  //   static async editStatus(req, res, next) {
  //     try {
  //       const { id } = req.params;
  //       const { status } = req.body;

  //       const package = await Package.findOne({
  //         where: {
  //           id,
  //         },
  //       });

  //       const editStatus = await Package.update(
  //         {
  //           status,
  //         },
  //         {
  //           where: {
  //             id,
  //           },
  //         }
  //       );

  //       if (!editStatus[0]) {
  //         throw { name: "ErrorEdit" };
  //       }

  //       await History.create({
  //         name: package.name,
  //         description: `Article status with id ${id} has been updated from ${package.status} to ${status}`,
  //         updatedBy: req.additionalData.email,
  //       });
  //       res.status(200).json({
  //         message: `Data with id ${id} has changed its status to ${status}`,
  //       });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  static async deletePackage(req, res, next) {
    try {
      const { id } = req.params;
      // console.log(id);
      const result = await Package.findOne({
        where: {
          id,
        },
      });

      console.log(result);

      const destroyed = await Package.destroy({ where: { id } });

      if (!destroyed) throw { name: "ErrorDelete" };

      // console.log(destroyed);

      res.status(200).json({
        message: `${result.dataValues.name} success to delete`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = packageController;
