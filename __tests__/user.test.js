const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");


describe("User Controller", () => {
  // Test data
  const users = require("./db_test/users.json");
  users.forEach((user) => {
    user.password = hashPassword(user.password)
  });

  beforeAll(async () => {
    try {
      await User.bulkCreate(users);
    } catch (err) {
      console.log(err, 111);
    }
  });

  afterAll(async () => {
    try {
      await User.sync({ force: true });
    } catch (err) {
      console.log(err);
    }
  });

  describe("GET /users", () => {
    it("should get a list of users", async () => {
      const response = await request(app)
        .get("/users")

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

  });

  describe("POST /users/register", () => {
    it("should register a new user", async () => {
      const newUser = {
        username: "newuser",
        email: "newuser@example.com",
        password: "passwordtest",
        birthDate: "2000-01-01",
        gender: "female",
      };

      const response = await request(app)
        .post("/users/register")
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("email", newUser.email);
    });
  });

  describe("POST /users/register", () => {
    it("should not register a new user with empty username", async () => {
      const newUser = {
        username: "", // Empty username
        email: "newuser@example.com",
        password: "passwordtest",
        birthDate: "2000-01-01",
        gender: "female",
      };

      const response = await request(app)
        .post("/users/register")
        .send(newUser);

      expect(response.status).toBe(400); // Expect a Bad Request status
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Username is required");
    });
  });

  describe("GET /users/:id", () => {
    it("should handle error when user ID is not available", async () => {
      const nonExistentUserId = 9999; // An ID that doesn't exist

      const response = await request(app)
        .get(`/users/${nonExistentUserId}`);

      expect(response.status).toBe(404); // Expect a Not Found status
      expect(response.body).toHaveProperty("message", "Data not found");
    });
  });

  describe("POST /users/login", () => {
    it("should log in an existing user", async () => {
      const selected_user = await User.findOne({
        where: { email: "emon@mail.com" },
      });

      const loginData = {
        email: selected_user.email,
        password: "123456",
      };

      const response = await request(app)
        .post("/users/login")
        .send(loginData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token");
      expect(response.body).toHaveProperty("id", selected_user.id);
      expect(response.body).toHaveProperty("email", selected_user.email);
      expect(response.body).toHaveProperty("role", selected_user.role);
    });

    it("should handle invalid login credentials", async () => {
      const invalidCredentials = {
        email: "invalid@example.com",
        password: "invalidpassword",
      };

      const response = await request(app)
        .post("/users/login")
        .send(invalidCredentials);

      expect(response.status).toBe(401); // Expect Unauthorized status
      expect(response.body).toHaveProperty("message", "Invalid email or password");
    });

    it("should handle invalid login credentials", async () => {
      const invalidCredentials = {
        email: "invalid@example.com",
        password: "invalidpassword",
      };

      const response = await request(app)
        .post("/users/login")
        .send(invalidCredentials);

      expect(response.status).toBe(401); // Expect Unauthorized status
      expect(response.body).toHaveProperty("message", "Invalid email or password");
    });
  });


  describe("GET /users/:id", () => {
    it("should get a user by ID", async () => {
      const selected_user = await User.findOne({
        where: { email: "emon@mail.com" },
      });

      const accessToken = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const response = await request(app)
        .get(`/users/${selected_user.id}`)
        .set("access_token", `${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", selected_user.id);
    });
  });

  describe("PUT /users/:id", () => {
    it("should edit a user by ID", async () => {
      const selected_user = await User.findOne({
        where: { email: "reva@mail.com" },
      });

      const accessToken = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });


      const editedData = {
        username: "newUsername",
        email: "newemail@example.com",
        // ... Other fields to edit
      };

      const response = await request(app)
        .put(`/users/${selected_user.id}`)
        .set("access_token", `${accessToken}`)
        .send(editedData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", `User with id ${selected_user.id} has been updated`);
    });

    it("should handle invalid user data during edit", async () => {
      const selected_user = await User.findOne({
        where: { email: "invalid@mail.com" },
      });

      const invalidEditData = {
        // Provide invalid user data here, such as empty fields or invalid values
        username: "",
        email: "invalidemail",
        birthDate: "invalidbirthdate",
        gender: "invalidgender",
      };

      const response = await request(app)
        .put(`/users/${8}`)
        .send(invalidEditData);

      expect(response.status).toBe(400); // Expect Bad Request status
      expect(response.body).toHaveProperty("message"); // Check for error message
    });
  });

  describe("DELETE /users/:id", () => {

    beforeEach(async () => {
      try {
        await User.bulkCreate(users);
      } catch (err) {
        console.log(err);
      }
    });

    it("should delete a user by ID", async () => {
      const selected_user = await User.findOne({
        where: { email: "afi@mail.com" },
      });

      const accessToken = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const response = await request(app)
        .delete(`/users/${selected_user.id}`)
        .set("access_token", `${accessToken}`);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message", `User with id ${selected_user.id} has been deleted`);
    });

    it("should handle user not found during deletion", async () => {
      const selected_user = await User.findOne({
        where: { email: "emon@mail.com" },
      });

      const accessToken = generateToken({
        id: selected_user.id,
        email: selected_user.email,
        role: selected_user.role,
      });

      const nonExistentUserId = 9999; // A user ID that doesn't exist

      const response = await request(app)
        .delete(`/users/${nonExistentUserId}`)
        .set("access_token", `${accessToken}`);

      expect(response.status).toBe(404); // Expect Not Found status
      expect(response.body).toHaveProperty("message", "Data not found"); // Check for error message
    });
  });
});
