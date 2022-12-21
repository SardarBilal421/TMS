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
var d = new Date();
d.setDate(d.getDate() - 1);
console.log();

const port = process.env.PORT;
const server = app.listen(port, () => {
  console.log("App os runing /.....");
});
