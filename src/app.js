const express = require("express");
const mongoose = require("mongoose")
require("dotenv").config({ path: './config/.env' });

const app = express();
const user_router = require("./routers/user");
const task_router = require("./routers/task");
const auth_router = require("./routers/login")
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))
app.use(user_router);
app.use(task_router);
app.use(auth_router);

app.listen(port, () => console.log(`express on ${port}`));
console.log(process.env.APP_HOST);
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

module.exports = app
