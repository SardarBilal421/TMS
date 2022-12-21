const express = require("express");
const router = express.Router();
const subscriptionController = require("../Controller/subscriptionController");

router.post("/", subscriptionController.subscribe);
router.get("/sendMail", subscriptionController.sendMails);

module.exports = router;
