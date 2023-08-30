const { MentorSchedule, User } = require("../models");

class MentorScheduleController {
  static async getMentorSchedule(req, res, next) {
    try {
      const mentorSchedules = await MentorSchedule.findAll({
        include: {
          model: User,
          attributes: ["username", "email", "role"],
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (mentorSchedules.length === 0) throw { name: "NotFound" };

      res.status(200).json(mentorSchedules);
    } catch (err) {
      next(err);
    }
  }

  static async createMentorSchedule(req, res, next) {
    try {
      const { date } = req.body;
      const { userId: UserId } = req.additionalData;

      if (!date) throw { name: "dateRequired" };

      const newSchedule = await MentorSchedule.create({
        date,
        UserId,
      });

      res.status(201).json(newSchedule);
    } catch (err) {
      next(err);
    }
  }

  static async patchMentorSchedule(req, res, next) {
    try {
      const { id } = req.params;

      const scheduleFound = await MentorSchedule.findOne({ where: { id } });

      if (!scheduleFound) throw { name: "NotFound" };

      const updatedStatus =
        scheduleFound.status === "available" ? "unavailable" : "available";

      await MentorSchedule.update({ status: updatedStatus }, { where: { id } });

      res.status(200).json({ message: "status updated" });
    } catch (err) {
      next(err);
    }
  }

  static async deleteMentorSchedule(req, res, next) {
    try {
      const { id } = req.params;
      const result = await MentorSchedule.findOne({
        where: {
          id,
        },
      });

      if (!result) throw { name: "NotFound" };

      const destroyed = await MentorSchedule.destroy({ where: { id } });

      res.status(200).json({
        message: `success to delete`,
      });
    } catch (err) {
      next(err);
    }
  }
}
module.exports = MentorScheduleController;