const express = require("express");
const router = express.Router();
const packageRouter = require("./packageRouter");
const userRouter = require("./userRouter");
const paymentRouter = require("./paymentRouter");
const roomRouter = require("./roomRouter");

router.use(roomRouter);
router.use(userRouter);
router.use(packageRouter);
router.use(paymentRouter);
router.use(roomRouter);

module.exports = router;
