const mongoose = require("mongoose");

const appError = require("./../Utilties/appError");
const FeaturesAPI = require("./../Utilties/features");
// const sendEmail = require("./../Utilties/catchAsync");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { off } = require("./../models/userModel");
const catchAsync = require("./../Utilties/catchAsync");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_IN,
  });
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new appError("You do not have permission to Access This Route", 403)
      );
    }
    next();
  };
};
