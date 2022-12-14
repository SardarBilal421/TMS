const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have name"],
  },
  email: {
    type: String,
    required: [true, "A user must have Email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid emaill"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    // select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please enter a password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin"],
  },
});

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
