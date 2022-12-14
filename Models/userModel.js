const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Console } = require("console");

const userSchema = mongoose.Schema({
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
    enum: ["publisher", "applicant"],
    default: "applicant",
  },
  isActive: {
    type: Boolean,
    select: false,
    default: true,
  },
  organization: {
    type: String,
  },
  website: {
    type: String,
  },
  address: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  mobile: {
    type: Number,
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
});

// userSchema.pre('save', function (next) {
//   if (!this.isModified('password') || this.isNew) return next();
//   this.passwordChangeAt = Date.now() - 1000;
//   next();
// });

userSchema.pre(/^find/, function (next) {
  // this points to the current Query

  this.find({ isActive: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// userSchema.methods.changePasswordAfter = function (JWTTimeStamp) {
//   if (this.passwordChangeAt) {
//     const changedTimeStamp = parseInt(
//       this.passwordChangeAt.getTime() / 1000,
//       10
//     );
//     return JWTTimeStamp < changedTimeStamp;
//   }

//   return false;
// };

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
