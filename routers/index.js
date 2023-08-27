const express = require("express");
const router = express.Router();
const packageRouter = require("./packageRouter");
const userRouter = require("./userRouter");
const paymentRouter = require("./paymentRouter");
const roomRouter = require("./roomRouter");
const activityRouter = require("./activity");
const MentorScheduleController = require("../controllers/mentorScheduleController");
router.get("/ms", MentorScheduleController.getMentorSchedule);
router.use("/users", userRouter);
router.use("/packages", packageRouter);
router.use("/payment", paymentRouter);
router.use("/rooms", roomRouter);
router.use("/activities", activityRouter);

module.exports = router;
