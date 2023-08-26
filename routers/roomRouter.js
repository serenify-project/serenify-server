const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/roomController");

router.get("/rooms", RoomController.getRoom);
router.post("/rooms", RoomController.createRoom);
router.delete("/rooms", RoomController.deleteRoom);

module.exports = router;
