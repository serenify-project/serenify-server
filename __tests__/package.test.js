const request = require("supertest");
const app = require("../app");
const { Package, User } = require("../models");
const { generateToken } = require("../helpers/jwt");

describe("Get All Packages", () => {
  beforeAll(async () => {
    // Delete all packages to ensure an empty result
    await Package.destroy({
      truncate: true,
    });
  });

  it('should respond with "Data not found" when there are no packages', async () => {
    const response = await request(app)
      .get("/packages")
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty("message", "Data not found");
  });
});

describe("testing package", () => {
  const packages = require("./db_test/packages.json");
  const users = require("./db_test/users.json");

  beforeAll(async () => {
    try {
      await User.bulkCreate(users);
      await Package.bulkCreate(packages);
    } catch (err) {
      console.log(err);
    }
  });

  afterAll(async () => {
    await Package.destroy({
      truncate: true,
      cascade: true,
      restartIdentity: true,
      force: true,
    });
    // await Movie.sync({ force: true });
    await User.sync({ force: true });
    // await Movie.sync({ force: true });
  });

  it("response all packages with json", async () => {
    const response = await request(app)
      //endpoiint
      .get("/packages")
      //header
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    const responseBody = response.body;
    expect(responseBody[0]).toHaveProperty("name", "Regular");
  });

  it("response detail packages with id", async () => {
    const id = 1;
    const response = await request(app)
      //endpoiint
      .get(`/packages/${id}`)
      //header
      .set("Accept", "application/json");

    expect(response.status).toEqual(200);
    const responseBody = response.body;
    expect(responseBody).toHaveProperty("name", "Regular");
  });

  it("response detail packages with id not found", async () => {
    const id = 999;
    const response = await request(app)
      //endpoiint
      .get(`/packages/${id}`)
      //header
      .set("Accept", "application/json");

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty("message", "Data not found");
  });

  it("add package", async () => {
    const selected_user = await User.findOne({
      where: { email: "reva@mail.com" },
    });

    let token = generateToken({
      id: selected_user.id,
      email: selected_user.email,
      role: selected_user.role,
    });

    const response = await request(app)
      .post(`/packages`)
      .send({
        name: "package testing",
        description: "Ini description untuk package testing",
        price: 10000,
        duration: 10000,
      })
      .set("access_token", token)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body.message).toHaveProperty("name", "package testing");
  });
  it("add package price required", async () => {
    const selected_user = await User.findOne({
      where: { email: "reva@mail.com" },
    });

    let token = generateToken({
      id: selected_user.id,
      email: selected_user.email,
      role: selected_user.role,
    });

    const response = await request(app)
      .post(`/packages`)
      .send({
        name: "package testing",
        description: "Ini description untuk package testing",
        duration: 10000,
      })
      .set("access_token", token)
      .set("Accept", "application/json");

    console.log(response.status, "<<< status");
    console.log(response.body, "<<< body");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", ["Price is required"]);
  });

  it("add package invalid because user", async () => {
    const selected_user = await User.findOne({
      where: { email: "user1@gmail.com" },
    });

    let token = generateToken({
      id: selected_user.id,
      email: selected_user.email,
      role: selected_user.role,
    });

    const response = await request(app)
      .post(`/packages`)
      .send({
        name: "package testing",
        description: "Ini description untuk package testing",
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

  it("add package no valid token", async () => {
    const response = await request(app)
      .post(`/packages`)
      .send({
        name: "package testing",
        description: "Ini description untuk package testing",
        price: 10000,
        duration: 10,
      })
      .set(
        "access_token",
        "eyJhbciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiZW1haWwiOiJ1c2VyM0BnbWFpbC5jb20iLCJyb2xlIjoibWVudGVlIiwiaWF0IjoxNjkzMjc5NzMwfQ.DaSMFYchNlYO3fXWwi0UrPQf8c9Ook2HCGYzW2Wk9pI"
      );
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Error Authentication");
  });

  it("edit package", async () => {
    const selected_user = await User.findOne({
      where: { email: "reva@mail.com" },
    });

    let token = generateToken({
      id: selected_user.id,
      email: selected_user.email,
      role: selected_user.role,
    });
    const id = 1;
    const response = await request(app)
      .put(`/packages/${id}`)
      .send({
        name: "package testing edit",
        description: "Ini description untuk package testing edit",
        price: 10000,
        duration: 10,
      })
      .set("access_token", token)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      `Data with id ${id} has been updated`
    );
  });

  it("should respond with 'Data not found' when editing package with non-existent ID", async () => {
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
      .put(`/packages/${nonExistentId}`)
      .send({
        name: "package testing edit",
        description: "Ini description untuk package testing edit",
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

  it("delete package by id not found", async () => {
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
      .delete(`/packages/${id}`)
      .set("access_token", token)
      .set("Accept", "application/json");

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", `Error not found`);
  });

  it("delete package", async () => {
    const selected_user = await User.findOne({
      where: { email: "emon@mail.com" },
    });

    let token = generateToken({
      id: selected_user.id,
      email: selected_user.email,
      role: selected_user.role,
    });

    const id = 1;
    const response = await request(app)
      .delete(`/packages/${id}`)
      .set("access_token", token)
      .set("Accept", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      `Package with id ${id} has been deleted`
    );
  });
});