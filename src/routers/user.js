const express = require("express");
const auth = require("../middleware/auth");
require("dotenv").config();
const User = require("../model/user");
const router = new express.Router();
router.use(express.json());
const userControllers=require('../controllers/user')



router.get("/me", auth, userControllers.getUser);
router.get("/logout", auth, userControllers.logout);
router.get("/logouts", auth, userControllers.logoutAll)
router.get("/:id", userControllers.userById );
router.patch("/me", auth, userControllers.patchAll);
router.patch("/:id", userControllers.patchById);
router.delete("/me", auth, userControllers.deleteByAuth);
router.delete("/:id", userControllers.deleteById);

module.exports = router