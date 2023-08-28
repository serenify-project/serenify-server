const request = require("supertest");
const app = require("../app");
const { User } = require("../models");
const { generateToken } = require("../helpers/jwt");

jest.mock("node-fetch"); // Mock node-fetch module

describe("Room Controller", () => {
    // Test data
    const users = require("./db_test/users.json");

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

    it("should get a list of rooms", async () => {
        const selected_user = await User.findOne({
            where: { email: "emon@mail.com" },
        });

        let accessToken = generateToken({
            id: selected_user.id,
            email: selected_user.email,
            role: selected_user.role,
        });

        require("node-fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValue([]), // Empty array for simplicity
        });

        // Send a GET request to fetch all available rooms

        const response = await request(app)
            .get("/rooms") // Use the correct route path here
            .set("access_token", `${accessToken}`);

        expect(response.status).toBe(200);
    });

    it("should create a new room", async () => {
        const selected_user = await User.findOne({
            where: { email: "emon@mail.com" },
        });

        let accessToken = generateToken({
            id: selected_user.id,
            email: selected_user.email,
            role: selected_user.role,
        });

        require("node-fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValue({}),
        });

        // Send a POST request to create a new room
        const response = await request(app)
            .post("/rooms")
            .set("access_token", `${accessToken}`);

        expect(response.status).toBe(201);
    });

    it("should delete a room", async () => {
        const selected_user = await User.findOne({
            where: { email: "emon@mail.com" },
        });

        let accessToken = generateToken({
            id: selected_user.id,
            email: selected_user.email,
            role: selected_user.role,
        });

        require("node-fetch").mockResolvedValue({
            json: jest.fn().mockResolvedValue({}),
        });

        // Send a DELETE request to delete a room
        const response = await request(app)
            .delete("/rooms/roomName") // Replace "roomName" with the actual name of the room to delete
            .set("access_token", `${accessToken}`);

        expect(response.status).toBe(200);
    });
});
