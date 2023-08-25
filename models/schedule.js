'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Package, { foreignKey: "packageId" })
    }
  }
  Schedule.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Schedule is required" },
        notEmpty: { msg: "Schedule is required" },
      },
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Package Id is required" },
        notEmpty: { msg: "Package Id is required" },
      },
    }
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};