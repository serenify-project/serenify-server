const PaymentController = require("../controllers/paymentController");
const Authentication = require("../middlewares/Authentication");
const router = require("express").Router();

router.post("/init", Authentication, PaymentController.initializePayment);
router.post("/success", Authentication, PaymentController.successPayment);
module.exports = router;
