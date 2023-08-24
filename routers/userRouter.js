const userController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const router = require("express").Router();

router.post("/users/login", userController.loginUser);
router.post("/users/register", userController.registerUser);

router.put("/users", Authentication, userController.editUser);
router.delete("/users", Authentication, userController.deleteUser);

module.exports = router;
