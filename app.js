const express = require("express");
const UserRouter = require("./Routes/UserRouter");
const PublishRouter = require("./Routes/publishRouter");
const adminRouter = require("./Routes/adminRouter");

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

module.exports = app;
