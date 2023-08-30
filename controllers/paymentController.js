const Stripe = require("stripe")(
  "sk_test_51Nihe8J9rr50hPJ7217oJJ7UjopaqchXZcGv7VB7H9uoxxyOuwbNrYoZH6a9BG4RU7vA5uq92w0H5aGNnLWHv93R00e0Hc3Cs1"
);
const { Package, User, Transaction } = require("../models");
const { v4: uuidv4 } = require("uuid");

class PaymentController {
  static async initializePayment(req, res, next) {
    try {
      console.log("hitted controller  <<<");
      const { userId } = req.additionalData;
      const { packageId } = req.body;

      console.log(packageId, "<<<");

      const packagePlan = await Package.findByPk(packageId);

      if (!packagePlan) {
        throw { name: "PxNotFound" };
      }

      const paymentIntent = await Stripe.paymentIntents.create({
        amount: packagePlan.dataValues.price,
        currency: "sgd",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.status(201).json({
        clientSecret: paymentIntent.client_secret,
        packageId: packageId,
        userId,
        amount: packagePlan.dataValues.price, // Use package price as amount
        paymentIntent,
      });
    } catch (error) {
      next(error);
    }
  }

  static async successPayment(req, res, next) {
    try {
      const { packageId } = req.body;

      const packagePlan = await Package.findByPk(packageId);

      if (!packagePlan) {
        throw { name: "PxNotFound" };
      }

      const orderId = `${Date.now()}-${uuidv4()}`;
      const transaction = await Transaction.create({
        status: "success",
        orderId: orderId,
        UserId: req.additionalData.userId,
        PackageId: packagePlan.id,
      });

      res
        .status(200)
        .json({ message: "Payment succeed", transactionId: transaction.id });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PaymentController;
