const express = require("express");
const router = express.Router();
const ActivityController = require("../controllers/activityController");
const Authentication = require("../middlewares/Authentication");

router.use(Authentication);
router.get("/", ActivityController.getActivities);

module.exports = router;
