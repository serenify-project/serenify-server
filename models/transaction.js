"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Package, { foreignKey: "PackageId" });
      Transaction.belongsTo(models.User, { foreignKey: "UserId" });
    }
  }
  Transaction.init(
    {
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Status is required" },
          notEmpty: { msg: "Status is required" },
        },
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "order Id Id is required" },
          notEmpty: { msg: "order Id Id is required" },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User Id is required" },
          notEmpty: { msg: "User Id is required" },
        },
      },
      PackageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "Package Id is required" },
          notEmpty: { msg: "Package Id is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
