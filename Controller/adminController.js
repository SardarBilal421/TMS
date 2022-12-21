const express = require("express");
const appError = require("../Utilties/appError");
const Admin = require("./../models/adminModel");
const catchAsync = require("../Utilties/catchAsync");
const jwt = require("jsonwebtoken");
const factory = require("./handlerFactory");
const { promisify } = require("util");

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
// exports.deleteAdmin = factory.deleteOne(Admin);
exports.createNewAdmin = factory.createOne(Admin);

exports.deleteAdmin = catchAsync(async (req, res, next) => {
  const doc = await Admin.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new appError("No doc found by this ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.signupAdmin = catchAsync(async (req, res, next) => {
  const newAdmin = await Admin.create(req.body);

  if (!newAdmin) {
    return next(new appError("Cannot Add New Admin ", 404));
  }

  // const newAdmin = await User.create(req.body);
  createSendToken(newAdmin, 201, res);
});

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

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_EXPIRES_EXPIRE_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // Remove passowrd from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.protect = catchAsync(async (req, res, next) => {
  //Getting tokken and check if its there or not
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new appError("Admin is not Logged In please Log in!!!!"));
  }
  // Verification Tokennn
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exits
  const currentAdmin = await Admin.findById(decode.id);
  if (!currentAdmin) {
    return next(
      new appError(
        "the user belonging to this token doesnot exisit Or you donot have permission to access thi route",
        401
      )
    );
  }
  // chec if user change password after logging in
  if (currentAdmin.changePasswordAfter(decode.iat)) {
    return next(new appError("Please Logged in again", 401));
  }
  req.user = currentAdmin;
  //GRAND ACCESS TO PROTEXTED ROUTE
  console.log(req.user);
  next();
});

exports.loginAdmin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please provide Email or password"), 400);
  }

  const user = await Admin.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect Email or passowrd", 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
  });
});
