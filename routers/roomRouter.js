const express = require("express");
const router = express.Router();
const RoomController = require("../controllers/roomController");

router.get("/", RoomController.getRoom);
router.post("/", RoomController.createRoom);
router.delete("/:name", RoomController.deleteRoom);

module.exports = router;
