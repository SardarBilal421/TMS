const appError = require("../Utilties/appError");
const catchAsync = require("../Utilties/catchAsync");
const factory = require("./handlerFactory");
const FeaturesAPI = require("../Utilties/features");
const Publish = require("./../Models/publishModel");

exports.getAllPublish = factory.getAll(Publish);
exports.getPublishByID = factory.getOne(Publish);
// Do not Update Password Using this Fucntion
exports.updatePublish = factory.updateOne(Publish);
exports.deletePublish = factory.deleteOne(Publish);
exports.createNewPublish = factory.createOne(Publish);
exports.getAllForUser = factory.getAllForUser(Publish);
exports.getAllFreePublish = factory.getAllFreePublish(Publish);

exports.getTime = catchAsync(async (req, res, next) => {
  const stats = await Publish.find({ deadLine: { $lte: Date.now() } });

  stats.forEach(
    async (el) => await Publish.findByIdAndUpdate(el._id, { isActive: false })
  );

  res.status(200).json({
    status: "success",
    Response: "All Expired Tenders Got deActivated",
  });
});
