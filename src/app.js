const express = require("express");
const app = express();

const user_router = require("./routers/user");
const task_router = require("./routers/task");
const auth_router = require("./routers/login")

// router.use(express.json());

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}))
app.use('/users',user_router);
app.use('/users',auth_router);
app.use('/tasks',task_router);




app.get("/", (req, res) => {
    res.json('Hello')
})

module.exports = app
