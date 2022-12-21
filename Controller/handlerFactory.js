const appError = require("../Utilties/appError");
const catchAsync = require("../Utilties/catchAsync");
const FeaturesAPI = require("../Utilties/features");

const filterObj = (obj, ...allowedFields) => {
  const NewObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      delete obj[el];
    }
  });
  return obj;
};

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    if (!doc) {
      return next(new appError("No doc found by this ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(User);
    const filterBody = filterObj(req.body, "name", "email", "role");

    const doc = await Model.findByIdAndUpdate(req.params.id, filterBody, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new appError("No doc found by this ID", 404));
    }
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) {
      return next(new appError("Cannot create this user", 404));
    }
    res.status(201).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new appError("No doc found by this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const feature = new FeaturesAPI(Model.find(), req.query)
      .sorting()
      .filtering()
      .limitingFields();

    const doc = await feature.queryy;

    res.status(200).json({
      status: "success",
      length: doc.length,
      data: {
        doc,
      },
    });
  });

exports.getAllForUser = (Model) =>
  catchAsync(async (req, res, next) => {
    const feature = new FeaturesAPI(
      Model.find({ userId: req.user._id }),
      req.query
    )
      .sorting()
      .filtering()
      .limitingFields();

    const doc = await feature.queryy;
    if (!doc) {
      return next(new appError("No doc found by Your ID", 404));
    }

    res.status(200).json({
      status: "success",
      length: doc.length,
      data: {
        doc,
      },
    });
  });
exports.getAllFreePublish = (Model) =>
  catchAsync(async (req, res, next) => {
    const feature = new FeaturesAPI(Model.find({ pfTender: "free" }), req.query)
      .sorting()
      .filtering()
      .limitingFields();

    const doc = await feature.queryy;
    if (!doc) {
      return next(new appError("No doc found by Your ID", 404));
    }

    res.status(200).json({
      status: "success",
      length: doc.length,
      data: {
        doc,
      },
    });
  });
