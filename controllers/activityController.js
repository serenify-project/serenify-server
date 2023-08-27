const { Activity } = require("../models/");
class ActivityController {
  static async getActivities(req, res, next) {
    try {
      const activities = await Activity.findAll();
      res.status(200).json(activities);
    } catch (err) {
      next(err);
    }
  }
}
module.exports = ActivityController;
