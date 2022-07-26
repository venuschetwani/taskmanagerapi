
const mongoose = require("mongoose");
require("dotenv").config({path: '../config/.env'});
console.log(process.env.URL)
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });











  