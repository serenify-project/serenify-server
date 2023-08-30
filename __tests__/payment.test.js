const request = require("supertest");
const app = require("../app");
const { Package, Transaction, User } = require("../models");
const { generateToken } = require("../helpers/jwt");


describe("Payment Controller", () => {
    const users = require("./db_test/users.json");
    const packages = require("./db_test/packages.json");

    beforeAll(async () => {
        try {
            await User.bulkCreate(users);
            await Package.bulkCreate(packages);
        } catch (err) {
            console.log(err, 111);
        }
    });

    afterAll(async () => {
        try {
            await Package.sync({ force: true });
            await User.sync({ force: true });
        } catch (err) {
            console.log(err);
        }
    });

    describe("POST /payment/init", () => {
        it("should initialize payment and return clientSecret", async () => {
            const dataPackage = await Package.findOne({
                where: { name: "Regular" },
            });

            const selected_user = await User.findOne({
                where: { email: "emon@mail.com" },
            });

            let accessToken = generateToken({
                id: selected_user.id,
                email: selected_user.email,
                role: selected_user.role,
            });

            const response = await request(app)
                .post("/payment/init")
                .set("access_token", `${accessToken}`)
                .send({ packageId: dataPackage.id });

            expect(response.status).toEqual(201);
            expect(response.body).toHaveProperty("clientSecret");
            expect(response.body).toHaveProperty("packageId", dataPackage.id);
            expect(response.body).toHaveProperty("userId", selected_user.id);
            expect(response.body).toHaveProperty("amount");
            expect(response.body.paymentIntent).toBeDefined();
        });

        it("should return PxNotFound when package is not found", async () => {
            const nonExistentPackageId = 9999; // ID doesn't exist

            const selected_user = await User.findOne({
                where: { email: "emon@mail.com" },
            });

            let accessToken = generateToken({
                id: selected_user.id,
                email: selected_user.email,
                role: selected_user.role,
            });

            const response = await request(app)
                .post("/payment/init")
                .set("access_token", `${accessToken}`)
                .send({ packageId: nonExistentPackageId });

            expect(response.status).toEqual(404);
            expect(response.body).toEqual({ message: "Package not found" });
        });
    });

    describe("POST /payment/success", () => {
        it("should handle successful payment and create a transaction", async () => {
            // Initialize a payment first

            const dataPackage = await Package.findOne({
                where: { name: "Regular" }
            })

            const selected_user = await User.findOne({
                where: { email: "emon@mail.com" },
            });

            let accessToken = generateToken({
                id: selected_user.id,
                email: selected_user.email,
                role: selected_user.role,
            });

            const paymentResponse = await request(app)
                .post("/payment/init")
                .set("access_token", `${accessToken}`)
                .send({ packageId: dataPackage.id });

            // Now, simulate a successful payment by sending a request to /payment/success
            const response = await request(app)
                .post("/payment/success")
                .set("access_token", `${accessToken}`)
                .send({ packageId: dataPackage.id });

            expect(response.status).toEqual(200);
            expect(response.body).toHaveProperty("message", "Payment succeed");
            expect(response.body).toHaveProperty("transactionId");
        });

        it("should return 'Package not found' message when package is not found", async () => {
            const nonExistentPackageId = 9999; // Assuming this ID does not exist

            const selected_user = await User.findOne({
                where: { email: "emon@mail.com" },
            });

            let accessToken = generateToken({
                id: selected_user.id,
                email: selected_user.email,
                role: selected_user.role,
            });

            const response = await request(app)
                .post("/payment/success")
                .set("access_token", `${accessToken}`)
                .send({ packageId: nonExistentPackageId });

            // Assert the response
            expect(response.status).toEqual(404); // Assuming 404 is the appropriate status code
            expect(response.body).toEqual({ message: "Package not found" });
        });
    });

});
