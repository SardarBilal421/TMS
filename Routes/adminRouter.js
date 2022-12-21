const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const authController = require("../Controller/authController");

router.post("/login", adminController.loginAdmin);

router.use(adminController.protect);
router.use(authController.restrictTo("admin"));

router.post("/signup", adminController.signupAdmin);

router.route("/").get(adminController.getAllAdmin);

router.route("/:id").delete(adminController.deleteAdmin);

module.exports = router;
