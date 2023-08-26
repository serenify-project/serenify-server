const DAILY_API_KEY =
  "c46f5cc5a62a8aac8d1e260bcfde880d64ae1be9ec126c0c37155e5aecbf54b3";
const DAILY_ROOM_URL = "https://api.daily.co/v1/rooms";
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
    try {
      const response = await fetch(DAILY_ROOM_URL, {
        method: "post",
        headers,
        body: JSON.stringify({
          name: "serenity-room",
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
      const response = await fetch(`${DAILY_ROOM_URL}/serenity-room`, {
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
