const express = require("express");
const router = express.Router();
const userController = require("../Controller/userController");
const authController = require("../Controller/authController");
const adminController = require("../Controller/adminController");

router.get(
  "/getMe",
  userController.protect,
  userController.getMe,
  userController.getUserByID
);

router.post("/signup", userController.signupUser);
router.post("/login", userController.loginUser);

router.post("/forgetPassword", userController.forgetPassword);
router.patch("/resetPassword/:token", userController.resetPassword);

// // Protect all Routes after this middleware

router.patch(
  "/updateMyPassword",
  userController.protect,
  userController.updatePassword
);

router.patch("/updateMe", userController.protect, userController.updateMe);

router.use(adminController.protect);
router.use(authController.restrictTo("admin"));
router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUserByID)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
