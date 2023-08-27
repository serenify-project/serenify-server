const { MentorSchedule, User } = require("../models");
class MentorScheduleController {
  static async getMentorSchedule(req, res, next) {
    try {
      const mentorSchedules = await MentorSchedule.findAll({
        include: {
          model: User,
        },

        // attributes: ["id", "date", "status", "UserId"],
      });
      console.log(mentorSchedules, 66);
      res.status(200).json(mentorSchedules);
    } catch (err) {
      next(err);
    }
  }

  static async deleteMentorSchedule(req, res, next) {
    try {
      const { id } = req.params;
      const result = await Package.findOne({
        where: {
          id,
        },
      });

      console.log(result);

      const destroyed = await MentorSchedule.destroy({ where: { id } });

      if (!destroyed) throw { name: "ErrorDelete" };

      res.status(200).json({
        message: `${result.dataValues.name} success to delete`,
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = MentorScheduleController;
