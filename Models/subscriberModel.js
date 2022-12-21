const mongoose = require("mongoose");
const validator = require("validator");

const subscriptionSchema = mongoose.Schema({
  category: {
    type: String,
    required: [true, "Subscription need to belong to some category"],
  },
  email: {
    type: String,
    requried: [true, "A Subscriber must have email"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid emaill"],
  },
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
