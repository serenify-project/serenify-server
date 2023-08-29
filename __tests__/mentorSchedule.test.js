const request = require("supertest");
const app = require("../app");
const { MentorSchedule, User, Package } = require("../models");
const { generateToken } = require("../helpers/jwt");
const mentorschedule = require("../models/mentorschedule");

describe("MentorScheduleController", () => {
  // Test data
  const users = require("./db_test/users.json");
  const packages = require("./db_test/packages.json");
  const mentorSchedules = require("./db_test/mentorSchedule.json");
  const testMentorSchedule = {
    date: new Date("2023-08-27"),
  };

  beforeAll(async () => {
    try {
      await User.bulkCreate(users);
      await Package.bulkCreate(packages);
      await MentorSchedule.bulkCreate(mentorSchedules);
    } catch (err) {
      console.log(err, 111);
    }
  });

  afterAll(async () => {
    try {
      await MentorSchedule.sync({ force: true });
      await Package.sync({ force: true });
      await User.sync({ force: true });
    } catch (err) {
      console.log(err);
    }
  });

  describe("GET /schedules", () => {
    it("should get a list of mentor schedules", async () => {
      const response = await request(app).get("/schedules");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /schedules", () => {
    it("should create a new mentor schedule", async () => {
      const selected_user = await User.findOne({
        where: { email: "emon@mail.com" },
      });
      let token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const response = await request(app)
        .post("/schedules")
        .send(testMentorSchedule)
        .set("access_token", token)
        .set("Accept", "application/json");

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("date", "2023-08-27T00:00:00.000Z");
    });
  });

  describe("PATCH /schedules/:id", () => {
    it("should patch a mentor schedule's status", async () => {
      const selected_user = await User.findOne({
        where: { email: "emon@mail.com" },
      });
      let token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const createResponse = await request(app)
        .post("/schedules")
        .send(testMentorSchedule)
        .set("access_token", token)
        .set("Accept", "application/json");

      const newStatus = {
        status: "unavailable"
      };

      // Update the schedule
      const updateSchedule = await MentorSchedule.update(newStatus, {
        where: {
          id: createResponse._body.id
        }
      }); // [1]

      // Fetch the updated schedule
      const fetchUpdatedSchedule = await MentorSchedule.findOne({
        where: {
          id: createResponse._body.id
        }
      });

      const patchResponse = await request(app)
        .patch(`/schedules/${fetchUpdatedSchedule.dataValues.id}`)
        .send({ status: fetchUpdatedSchedule.dataValues.status })
        .set("access_token", token)
        .set("Accept", "application/json");

      expect(patchResponse.status).toBe(200);
      expect(patchResponse.body).toHaveProperty("message", "status updated");
    });
  });



  describe("DELETE /schedules/:id", () => {
    it("should delete a mentor schedule", async () => {
      const selected_user = await User.findOne({
        where: { email: "emon@mail.com" },
      });

      let token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const createResponse = await request(app)
        .post("/schedules")
        .send(testMentorSchedule)
        .set("access_token", token)
        .set("Accept", "application/json");

      const response = await request(app)
        .delete(`/schedules/${createResponse.body.id}`)
        .send()
        .set("access_token", token)
        .set("Accept", "application/json");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "success to delete");
    });
  });
});