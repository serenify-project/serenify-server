const userController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const router = require("express").Router();

router.post("/users", userController.loginUser);
router.post("/users", userController.registerUser);

router.use(Authentication);

router.put("/users", userController.editUser);
router.delete("/users", userController.deleteUser);

module.exports = router;
