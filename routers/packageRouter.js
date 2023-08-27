const express = require("express");
const router = express.Router();
const PackageController = require("../controllers/packageController");
const Authentication = require("../middlewares/Authentication");

router.get("/", PackageController.getAllPackages);
router.get("/:id", PackageController.getPackageById);

router.use(Authentication);

router.post("/", PackageController.addNewPackage);
router.put("/:id", PackageController.editPackage);
router.delete("/:id", PackageController.deletePackage);

module.exports = router;
