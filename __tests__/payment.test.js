const request = require("supertest");
const app = require("../app");
const { Package, Transaction, User } = require("../models");
const { generateToken } = require("../helpers/jwt");


// Mock the Stripe module
const Stripe = require("stripe");
jest.mock("stripe");

describe("Payment Controller", () => {
    const users = require("./db_test/users.json");
    const packages = require("./db_test/packages.json");

    // Set up mock Stripe response
    const mockClientSecret = "pi_3NjzdiJ9rr50hPJ71rtPTJfs_secret_hQaJ52FGH14ehgM6GUC5RBRse";
    const mockPaymentIntent = {
        client_secret: mockClientSecret,
        id: "pi_3NjyOBJ9rr50hPJ71wppepzp",
        object: "payment_intent",
        amount: 300000,
        amount_capturable: 0,
        amount_details: {
            tip: {},
        },
        amount_received: 0,
        application: null,
        application_fee_amount: null,
        automatic_payment_methods: {
            allow_redirects: "always",
            enabled: true,
        },
        canceled_at: null,
        cancellation_reason: null,
        capture_method: "automatic",
        confirmation_method: "automatic",
        created: 1693202007,
        currency: "sgd",
        customer: null,
        description: null,
        invoice: null,
        last_payment_error: null,
        latest_charge: null,
        livemode: false,
        metadata: {},
        next_action: null,
        on_behalf_of: null,
        payment_method: null,
        payment_method_options: {
            card: {
                installments: null,
                mandate_options: null,
                network: null,
                request_three_d_secure: "automatic",
            },
        },
        payment_method_types: ["card"],
        processing: null,
        receipt_email: null,
        review: null,
        setup_future_usage: null,
        shipping: null,
        source: null,
        statement_descriptor: null,
        statement_descriptor_suffix: null,
        status: "requires_payment_method",
        transfer_data: null,
        transfer_group: null,
    };

    // Mock the paymentIntents.create method
    Stripe.paymentIntents.create.mockResolvedValue(mockPaymentIntent);

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
                where: { name: "Regular" }
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
            expect(response.body).toHaveProperty("client_secret", mockClientSecret);
            expect(response.body).toHaveProperty("packageId", dataPackage.id);
            expect(response.body).toHaveProperty("userId", selected_user.id);
            expect(response.body).toHaveProperty("amount", mockPaymentIntent.amount);
            expect(response.body).toHaveProperty("paymentIntent");
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
    });

});
