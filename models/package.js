"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Package extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Package.hasMany(models.Transaction, { foreignKey: "PackageId" });
      Package.hasMany(models.Schedule, { foreignKey: "PackageId" });
    }
  }
  Package.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Description is required" },
          notEmpty: { msg: "Description is required" },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Price is required" },
          notEmpty: { msg: "Price is required" },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Duration is required" },
          notEmpty: { msg: "Duration is required" },
        },
      },
      schedule: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Schedule is required" },
          notEmpty: { msg: "Schedule is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Package",
    }
  );
  return Package;
};
