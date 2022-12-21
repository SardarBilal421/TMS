const express = require("express");
const router = express.Router();
const publishController = require("../Controller/publishController");
const userController = require("../Controller/userController");
const authController = require("../Controller/authController");

router.get("/deActivateExpireTenderstime", publishController.getTime);

router.get("/free", publishController.getAllFreePublish);

router.use(userController.protect);

router.get("/userGetPublisher", publishController.getAllForUser);

router
  .route("/")
  .get(publishController.getAllPublish)
  .post(publishController.createNewPublish);

router
  .route("/:id")
  .get(publishController.getPublishByID)
  // .patch(publishController.updatePublish)
  .delete(publishController.deletePublish);

module.exports = router;
