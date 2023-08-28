const request = require("supertest");
const app = require("../app");
const { Package, User } = require("../models");
const { generateToken } = require("../helpers/jwt");

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

  it("add package", async () => {
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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyZXZhQG1haWwuY29tIiwicm9sZSI6Im1lbnRvciIsImlhdCI6MTY5MzE5OTM1NywiZXhwIjoxNjkzMjg1NzU3fQ.k9jSqfjp-qq9bPAh1hg1MlICQyg8gvCiQjy48wnHLq4"
      )
      .set("Accept", "application/json");

    console.log(response.body, "<< response status nya");

    expect(response.status).toBe(201);
    expect(response.body.message).toHaveProperty("name", "package testing");
  });

  it("edit package", async () => {
    const response = await request(app)
      .put(`/packages/1`)
      .send({
        name: "package testing edit",
        description: "Ini description untuk package testing edit",
        price: 10000,
        duration: 10,
      })
      .set(
        "access_token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyZXZhQG1haWwuY29tIiwicm9sZSI6Im1lbnRvciIsImlhdCI6MTY5MzE5OTM1NywiZXhwIjoxNjkzMjg1NzU3fQ.k9jSqfjp-qq9bPAh1hg1MlICQyg8gvCiQjy48wnHLq4"
      )
      .set("Accept", "application/json");

    console.log(response.body, "<< response status nya");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Data with id 1 has been updated"
    );
  });

  it("delete package", async () => {
    const response = await request(app)
      .delete(`/packages/1`)
      .set(
        "access_token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyZXZhQG1haWwuY29tIiwicm9sZSI6Im1lbnRvciIsImlhdCI6MTY5MzE5OTM1NywiZXhwIjoxNjkzMjg1NzU3fQ.k9jSqfjp-qq9bPAh1hg1MlICQyg8gvCiQjy48wnHLq4"
      )
      .set("Accept", "application/json");

    console.log(response.body, "<< response status nya");

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty(
      "message",
      "Package with id 1 has been deleted"
    );
  });
});
