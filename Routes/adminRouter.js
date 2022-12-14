const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const authController = require("../Controller/authController");

router
  .route("/")
  .get(authController.restrictTo("admin"), adminController.getAllAdmin)
  .post(authController.restrictTo("admin"), adminController.createNewAdmin);

router
  .route("/:id")
  //   .get(adminController.getPublishByID)
  //   .patch(adminController.updatePublish)
  .delete(authController.restrictTo("admin"), adminController.deleteAdmin);

module.exports = router;
