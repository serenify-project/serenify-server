const UserController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const Authorization = require("../middlewares/Authorization");
const router = require("express").Router();

router.get("/", UserController.getUsers);
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);
router.get("/trx/:id", Authentication, UserController.cekUserTransaction);
router.get("/:id", UserController.getUserById);
router.get("/:id", UserController.getUserById);
router.put("/:id", UserController.editUser);
router.use(Authentication);
router.put("/:id", UserController.editUser);
router.use(Authorization);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
