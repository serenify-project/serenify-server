const request = require("supertest");
const app = require("../app");
const { Package, User } = require("../models");
const { generateToken } = require("../helpers/jwt");

describe("testing package", () => {
  const packages = require("./db_test/dataPackage.json");
  const users = require("./db_test/dataUser.json");

  let user;
  let token;

  beforeAll(async () => {
    try {
      // await User.bulkCreate(users);
      // user = await User.findByPk(2);
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
    // await User.sync({ force: true });
    // await Movie.sync({ force: true });
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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJ1c2VyMkBnbWFpbC5jb20iLCJyb2xlIjoibWVudG9yIiwiaWF0IjoxNjkzMTA0MTMxLCJleHAiOjE2OTMxOTA1MzF9.SEiaCaLTtZkBEwB3--pwlqRXhzbSsMMIgTt0jE1HYg0",
      )
      .set("Accept", "application/json");

    console.log(response.body, "<< response status nya");

    expect(response.status).toBe(201);
    expect(response.body.message).toHaveProperty("name", "package testing");
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
});
