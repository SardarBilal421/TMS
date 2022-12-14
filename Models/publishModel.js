const mongoose = require("mongoose");
const validator = require("validator");
const publishSchema = mongoose.Schema({
  firstName: {
    type: String,
    requried: [true, "A tender must have first name"],
  },
  lastName: {
    type: String,
    requried: [true, "A tender must have last name"],
  },
  email: {
    type: String,
    requried: [true, "A tender must have email"],
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid emaill"],
  },
  organization: {
    type: String,
    requried: [true, "A tender must have organization"],
  },
  city: {
    type: String,
    requried: [true, "A tender must belong to some city"],
  },
  country: {
    type: String,
    requried: [true, "A tender must belong to some country"],
  },
  mobileNo: {
    type: Number,
    requried: [true, "A tender must have Mobile number"],
  },
  webiste: {
    type: String,
  },
  title: {
    type: String,
  },
  keywords: {
    type: [String],
  },
  bidType: {
    type: String,
  },
  foundingAgency: {
    type: String,
  },
  deadLine: {
    type: Date,
  },
  cost: {
    type: Number,
  },
  tenderType: {
    type: String,
  },
  noticeType: {
    type: String,
  },
  sector: {
    type: String,
  },
  publishDate: {
    type: Date,
    default: Date,
  },
  files: {
    type: [String],
  },
  pfTender: {
    type: String,
    enum: ["paid", "free"],
    default: "free",
  },
  comments: {
    type: String,
  },
  isActive: {
    type: Boolean,
    select: false,
    default: true,
  },
});

publishSchema.pre(/^find/, function (next) {
  // this points to the current Query

  this.find({ isActive: { $ne: false } });
  next();
});

const Publish = mongoose.model("Publish", publishSchema);

module.exports = Publish;
