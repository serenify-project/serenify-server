const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/roomController");
const Authentication = require("../middlewares/Authentication");

router.use(Authentication);
router.get("/", RoomController.getRoom);
router.post("/", RoomController.createRoom);
router.delete("/:name", RoomController.deleteRoom);

module.exports = router;
