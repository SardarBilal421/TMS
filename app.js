const express = require("express");
const UserRouter = require("./Routes/UserRouter");
const PublishRouter = require("./Routes/publishRouter");
const adminRouter = require("./Routes/adminRouter");
const subscribeRouter = require("./Routes/subRouter");
const appError = require("./Utilties/appError");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1/users", UserRouter);
app.use("/api/v1/publisher", PublishRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/subscribe", subscribeRouter);

app.all("*", (req, res, next) => {
  next(
    new appError(`Requested Page : ${req.originalUrl} not on this server`, 404)
  );
});

module.exports = app;
