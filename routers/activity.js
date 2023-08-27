const express = require("express");
const router = express.Router();
const ActivityController = require("../controllers/activityController");
router.get("/", ActivityController.getActivities);

module.exports = router;
