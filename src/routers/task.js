const express = require("express");
const auth = require("../middleware/auth");
const router = new express.Router();
const taskControllers = require('../controllers/task')

router.post("", auth, taskControllers.addtask);
router.get("", auth, taskControllers.getTask);
router.get("/:id", auth, taskControllers.getTaskById);
router.patch("/:id", auth, taskControllers.taskpatchById);
router.delete("/:id", auth, taskControllers.taskdelete);



module.exports = router;
