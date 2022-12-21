const appError = require("./../Utilties/appError");
const sendEmail = require("./../Utilties/email");
const catchAsync = require("./../Utilties/catchAsync");
const Subscriber = require("./../Models/subscriberModel");
const Publish = require("./../Models/publishModel");

exports.subscribe = catchAsync(async (req, res, next) => {
  const sub = await Subscriber.create(req.body);
  if (!sub) {
    return next(new appError("Cannot Subscribe", 404));
  }
  res.status(201).json({
    status: "success",
    data: {
      sub,
    },
  });
});

exports.sendMails = catchAsync(async (req, res, next) => {
  const sub = await Subscriber.find();
  try {
    sub.forEach(async (el) => {
      await sendEmail({
        email: el.email,
        subject: `We have new tenders in ${el.category} Category.. `,
        message: "message",
      });
    });
    res.status(200).json({
      status: "success",
      message: "token sent to emial",
    });
    console.log("there we are");
  } catch (err) {
    console.log("Error", err.message);
  }
});
