const UserController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const Authorization = require("../middlewares/Authorization");
const router = require("express").Router();

router.get("/", UserController.getUsers);
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);

router.use(Authentication);
router.use(Authorization);
router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.editUser);

module.exports = router;
