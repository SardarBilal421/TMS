const express = require("express");
const appError = require("../Utilties/appError");
const User = require("./../models/userModel");
const catchAsync = require("../Utilties/catchAsync");
const factory = require("./handlerFactory");
const sendEmail = require("./../Utilties/email");

const FeaturesAPI = require("./../Utilties/features");
const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { off } = require("./../models/userModel");

const filterObj = (obj, ...allowedFields) => {
  const NewObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      NewObj[el] = obj[el];
    }
  });
  return NewObj;
};

exports.getAllUsers = factory.getAll(User);
exports.getUserByID = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// AUTHENTICATION

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
    return next(new appError("User is not Logged In please Log in!!!!"));
  }
  // Verification Tokennn
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // check if user still exits
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(
      new appError("the user belonging to this token doesnot exisit", 401)
    );
  }
  // chec if user change password after logging in
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(new appError("Please Logged in again", 401));
  }
  req.user = currentUser;
  //GRAND ACCESS TO PROTEXTED ROUTE
  next();
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  //Get user based on posted Emial
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new appError("THere is no User with such email", 404));
  }

  //Generate the Random emial reset Token
  const userRestToken = user.createPasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  //Send it to user Email

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetPassword/${userRestToken}`;

  const message = ` forget your emial??? please send you passord and confirmPassword with this emial::${resetUrl}. \n if you didnt forget Email Please igone this mail `;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token valid for 10 min",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "token sent to emial",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save({
      validateBeforeSave: false,
    });

    return next(new appError("there is and error in sending your emial"), 500);
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1)  Get user based on the token

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
  });

  // 2) if token has not expired and there is user, set the new password

  if (!user) {
    return next(new appError("Tokeen is invalid or has expored", 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  // 3) update changePasswordAt property for the user

  // 4) log the user in ,send JWT

  createSendToken(user, 201, res);
  // const token = signToken(user._id);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user.id).select("+password");
  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new appError("Your current Password is wrong", 401));
  }
  // 3) if so, update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // 4) Log user in and send JWT

  createSendToken(user, 200, res);
});

exports.signupUser = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  if (!newUser) {
    return next(new appError("Cannot create this user", 404));
  }

  // const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new appError("Please provide Email or password"), 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new appError("Incorrect Email or passowrd", 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    role: user.role,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user Post password
  if (req.body.password || req.body.passwordConfirm) {
    next(
      new appError(
        "This Route is not For Password, Please go to /updateMyPassword route",
        400
      )
    );
  }

  // 2) Filtering out Unwanted Fieldds
  const filterBody = filterObj(req.body, "name", "email", "role");

  // 3) Update user Documents

  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
