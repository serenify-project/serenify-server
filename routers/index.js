const express = require("express");
const router = express.Router();
const packageRouter = require("../routers/packageRouter");
const userRouter = require("../routers/userRouter");
const paymentRouter = require("../routers/paymentRouter.js")

router.use(userRouter);
router.use(packageRouter);
router.use(paymentRouter)

module.exports = router;
