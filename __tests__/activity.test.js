const request = require("supertest");
const app = require("../app");
const { Activity, User, MentorSchedule, Package } = require("../models");
const { generateToken } = require("../helpers/jwt");

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
