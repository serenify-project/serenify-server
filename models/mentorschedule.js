"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MentorSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MentorSchedule.hasMany(models.Activity, {
        foreignKey: "MentorScheduleId",
      });
      MentorSchedule.belongsTo(models.User, {
        foreignKey: "UserId",
      });
    }
  }
  MentorSchedule.init(
    {
      date: DataTypes.DATE,
      status: DataTypes.STRING,
      UserId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MentorSchedule",
    },
  );
  return MentorSchedule;
};
