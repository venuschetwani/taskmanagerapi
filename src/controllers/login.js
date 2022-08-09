const User = require("../model/user");
const express = require("express");
const { sendWelcomemail } = require("../emails/account")
const app = express();
const router = new express.Router();
app.use(express.json());
const sharp = require('sharp')
const jwt = require('jsonwebtoken')
const multer = require('multer')
require("../db/mongoose");

exports.addUser=async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save()
      sendWelcomemail(user.email, user.name)
  
      res.status(201).send(user)
      
    }
    catch (e) {
      res.status(404).send();
    }
  
  }

exports.loginUser= async (req, res) => {
    try {
      const user = await User.findByCredintials(
        req.body.email,
        req.body.password
      )
  
      await User.lastLogin(user._id)
      const token = await user.tokenauthkey()
      const isExpired = await User.checkTokenExpiry(token)
      if (isExpired) {
        res.status(404).send("token is expired")
      }
  
  
      else {
        res.send({ user, token })
      }
    } catch (e) {
      res.status(500).send(e);
    }
  } 


  //image uploading

  exports.nature = multer({

    limits: {
      fileSize: 1000000
    },
    fileFilter(req, file, cb) {
  
  
      if (!file.originalname.match(/(\.jpg|jpeg|png)$/)) {
        return cb(new Error('please upload image'))
      }
      cb(undefined, true)
    }
  })


   

exports.natureimage=async (req, res) => {
   const buffer = await sharp(req.file.buffer).resize({ width: 50, height: 50 }).png().toBuffer()
   const data =buffer.toString()
   req.user.nature = data
    await req.user.save()
    res.send('binary file saved')
  }, (error,  res) => {
    res.status(400).send({
      error: error.message
    })
  }

exports.deleteimage=async (req, res) => {
    req.user.nature = undefined
    await req.user.save()
    res.send("image deleted")
  }, (error, res,) => {
    res.status(400).send({
      error: error.message
    })
  } 
  
exports.getimageById= async (req, res) => {
    try {
      const user = await User.findById(req.params.id)
  
      if (!user || !user.nature) {
        throw new Error()
      }
      res.set('Content-Type', 'image/png')
      res.send(user.nature)
  
  
    } catch (e) {
      res.status(404).send()
    }
  }  