require("../db/mongoose");
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const router = new express.Router();
const authControllers=require('../controllers/login')


router.post("", authControllers.addUser)
router.post("/login", authControllers.loginUser);


//image uploading
router.post('/nature', auth,authControllers.nature.single('nature'),  authControllers.natureimage)
router.get('/nature/:id',authControllers.getimageById)
router.delete('/nature', auth, authControllers.deleteimage)




module.exports = router;


