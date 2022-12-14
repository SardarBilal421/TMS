const express = require("express");
const appError = require("../Utilties/appError");
const Admin = require("./../models/adminModel");
const catchAsync = require("../Utilties/catchAsync");
const factory = require("./handlerFactory");

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

exports.getAllAdmin = factory.getAll(Admin);
exports.getAdminByID = factory.getOne(Admin);
// Do not Update Password Using this Fucntion
exports.updateAdmin = factory.updateOne(Admin);
exports.deleteAdmin = factory.deleteOne(Admin);
exports.createNewAdmin = factory.createOne(Admin);
