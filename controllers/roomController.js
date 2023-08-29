const DAILY_API_KEY = process.env.DAILY_API_KEY;
const DAILY_ROOM_URL = process.env.DAILY_ROOM_URL;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${DAILY_API_KEY}`,
};

class RoomController {
  static async getRoom(req, res, next) {
    try {
      const response = await fetch(DAILY_ROOM_URL, {
        method: "get",
        headers,
      });
      const rooms = await response.json();
      res.status(200).json(rooms);
    } catch (err) {
      console.log(err);
    }
  }

  static async createRoom(req, res, next) {
    // const { v4: uuidv4 } = require("uuid");
    try {
      const response = await fetch(DAILY_ROOM_URL, {
        method: "post",
        headers,
        body: JSON.stringify({
          name: `serenity-room-${Math.floor(Math.random() * 10000)}`,
          privacy: "public",
          properties: {
            start_audio_off: true,
            start_video_off: true,
          },
        }),
      });
      const newRoom = await response.json();
      res.status(201).json(newRoom);
    } catch (err) {
      console.log(err);
    }
  }

  static async deleteRoom(req, res, next) {
    try {
      const { name } = req.params;
      const response = await fetch(`${DAILY_ROOM_URL}/${name}`, {
        method: "delete",
        headers,
      });
      const deletedRoom = await response.json();
      res.status(200).json(deletedRoom);
    } catch (err) {
      console.log(err);
    }
  }
}
module.exports = RoomController;
