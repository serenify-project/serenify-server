"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsTo(models.User, { foreignKey: "UserId" });
      Activity.belongsTo(models.MentorSchedule, {
        foreignKey: "MentorScheduleId",
      });
    }
  }
  Activity.init(
    {
      schedule: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Schedule is required",
          },
          notEmpty: {
            msg: "Schedule is required",
          },
        },
      },
      type: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Status is required",
          },
          notEmpty: {
            msg: "Status is required",
          },
        },
      },
      roomUrl: {
        type: DataTypes.STRING,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
      MentorScheduleId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Activity",
    },
  );
  return Activity;
};
