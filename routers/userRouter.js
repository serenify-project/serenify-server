const userController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const router = require("express").Router();

router.post("/users/login", userController.loginUser);
router.post("/users/register", userController.registerUser);

router.delete("/users/:id", userController.deleteUser);
router.put("/users/:id", userController.editUser);

module.exports = router;
