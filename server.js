const app = require("./app");
const dotdev = require("dotenv");
const mongoose = require("mongoose");

dotdev.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose.set("strictQuery", true);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("DataBase COnnection Successfull");
  });
const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("App os runing /.....");
});
