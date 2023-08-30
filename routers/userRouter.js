const UserController = require("../controllers/userController");
const Authentication = require("../middlewares/Authentication");
const Authorization = require("../middlewares/Authorization");
const router = require("express").Router();

router.get("/", UserController.getUsers);
router.post("/login", UserController.loginUser);
router.post("/register", UserController.registerUser);
router.get("/trx/", Authentication, UserController.cekUserTransaction);
router.get("/detail", Authentication, UserController.getUserById);
router.put("/edit", Authentication, UserController.editUser);
router.use(Authentication);
router.put("/:id", UserController.editUser);
router.use(Authorization);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
