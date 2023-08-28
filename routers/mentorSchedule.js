const express = require("express");
const router = express.Router();
const Authentication = require("../middlewares/Authentication");
const Authorization = require("../middlewares/Authorization");

const MentorScheduleController = require("../controllers/mentorScheduleController");

router.get("/", MentorScheduleController.getMentorSchedule);

router.use(Authentication);

router.post("/", Authorization, MentorScheduleController.createMentorSchedule);
router.patch("/:id", MentorScheduleController.patchMentorSchedule);
router.delete(
  "/:id",
  Authorization,
  MentorScheduleController.deleteMentorSchedule,
);

module.exports = router;
