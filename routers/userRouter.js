const UserController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const router = require("express").Router();

router.get("/", UserController.getUsers);
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);

router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.editUser);

module.exports = router;
