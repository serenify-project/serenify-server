const request = require("supertest");
const app = require("../app");
const { Activity, User, MentorSchedule, Package } = require("../models");
const { generateToken } = require("../helpers/jwt");

describe("Get All Activity if not found", () => {
    const users = require("./db_test/users.json");

    beforeAll(async () => {
        // Delete all packages to ensure an empty result
        await Activity.destroy({
            truncate: true,
        });
        await User.bulkCreate(users);
    });

    afterAll(async () => {
        await User.sync({ force: true });
    });

    it('should respond with "Data not found" when there are no activities', async () => {
        const selected_user = await User.findOne({
            where: { email: "reva@mail.com" },
        });

        let token = generateToken({
            id: selected_user.id,
            email: selected_user.email,
            role: selected_user.role,
        });

        const response = await request(app)
            .get("/activities")
            .set("access_token", token)
            .set("Accept", "application/json");

        expect(response.status).toEqual(404);
        expect(response.body).toHaveProperty("message", "Data not found");
    });
});

describe("Activity Controller", () => {
    // Test data
    const users = require("./db_test/users.json");
    const packages = require("./db_test/packages.json");
    const mentorSchedules = require("./db_test/mentorSchedule.json");

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
            await Package.sync({ force: true });
            await User.sync({ force: true });
            await MentorSchedule.sync({ force: true });
        } catch (err) {
            console.log(err);
        }
    });

    describe("GET /activities", () => {
        it("should get a list of activities", async () => {
            const selected_user = await User.findOne({
                where: { email: "emon@mail.com" },
            });

            let accessToken = generateToken({
                id: selected_user.id,
                email: selected_user.email,
                role: selected_user.role,
            });

            await Activity.bulkCreate([
                { schedule: new Date(), status: "active", UserId: 1 },
                { schedule: new Date(), status: "inactive", UserId: 2 },
            ]);

            const response = await request(app)
                .get("/activities")
                .set("access_token", accessToken);

            expect(response.status).toBe(200);
        });
    });
});