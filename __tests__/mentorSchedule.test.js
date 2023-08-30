const request = require("supertest");
const app = require("../app");
const { MentorSchedule, User, Package } = require("../models");
const { generateToken } = require("../helpers/jwt");

describe("Get All Schedules", () => {
  beforeAll(async () => {
    // Delete all packages to ensure an empty result
    await MentorSchedule.destroy({
      truncate: true,
    });
  });

  it('should respond with "Data not found" when there are no schedule', async () => {
    const response = await request(app)
      .get("/schedules")
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty("message", "Data not found");
  });
});

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

    it("add schedule date required", async () => {
      const selected_user = await User.findOne({
        where: { email: "reva@mail.com" },
      });

      let token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const response = await request(app)
        .post(`/schedules`)
        .send({
          name: "schedule testing",
          description: "Ini description untuk schedule testing",
          duration: 10000,
        })
        .set("access_token", token)
        .set("Accept", "application/json");

      console.log(response.status, "<<< status");
      console.log(response.body, "<<< body");

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Date is required");
    });

    it("add schedule invalid because user", async () => {
      const selected_user = await User.findOne({
        where: { email: "user1@gmail.com" },
      });

      let token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const response = await request(app)
        .post(`/schedules`)
        .send({
          name: "schedule testing",
          description: "Ini description untuk schedule testing",
          price: 10000,
          duration: 10,
        })
        .set("access_token", token);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty(
        "message",
        "Forbidden Error Authorization"
      );
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
        status: "unavailable",
      };

      // Update the schedule
      const updateSchedule = await MentorSchedule.update(newStatus, {
        where: {
          id: createResponse._body.id,
        },
      }); // [1]

      // Fetch the updated schedule
      const fetchUpdatedSchedule = await MentorSchedule.findOne({
        where: {
          id: createResponse._body.id,
        },
      });

      const patchResponse = await request(app)
        .patch(`/schedules/${fetchUpdatedSchedule.dataValues.id}`)
        .send({ status: fetchUpdatedSchedule.dataValues.status })
        .set("access_token", token)
        .set("Accept", "application/json");

      expect(patchResponse.status).toBe(200);
      expect(patchResponse.body).toHaveProperty("message", "status updated");
    });

    it("should respond with 'Data not found' when editing schedules status with non-existent ID", async () => {
      // Assuming you have a valid `generateToken` function
      const selected_user = await User.findOne({
        where: { email: "reva@mail.com" },
      });

      const token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const nonExistentId = 999; // Use an ID that doesn't exist in your database
      const response = await request(app)
        .patch(`/schedules/${nonExistentId}`)
        .send({
          name: "schedules testing edit",
          description: "Ini description untuk schedules testing edit",
          price: 10000,
          duration: 10,
        })
        .set("access_token", token)
        .set("Accept", "application/json");

      console.log(response.status, "<<< response status");
      console.log(response.body, "<<< response body");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Data not found");
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

    it("delete schedule by id not found", async () => {
      const selected_user = await User.findOne({
        where: { email: "reva@mail.com" },
      });

      let token = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const id = 999;
      const response = await request(app)
        .delete(`/schedules/${id}`)
        .set("access_token", token)
        .set("Accept", "application/json");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", `Data not found`);
    });
  });
});