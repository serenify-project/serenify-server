const express = require("express");
const router = express.Router();
const packageRouter = require("../routers/packageRouter");
const userRouter = require("../routers/userRouter");

router.use(userRouter);
router.use(packageRouter);

module.exports = router;
