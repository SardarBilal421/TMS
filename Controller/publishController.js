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
