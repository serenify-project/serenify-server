const express = require("express");
const router = express.Router();
const packageController = require("../controllers/packageController");
const Authentication = require("../middlewares/Authentication");

router.get("/packages", packageController.getAllPackages);
router.get("/packages/:id", packageController.getPackageById);

router.use(Authentication);
router.post("/packages", packageController.addNewPackage);
router.put("/packages/:id", packageController.editPackage);
router.delete("/packages/:id", packageController.deletePackage);

module.exports = router;
