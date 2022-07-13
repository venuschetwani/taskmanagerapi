const express = require("express");
const User = require("../model/user");
require("../db.js/moongoose");
const jwt =require('jsonwebtoken')
const multer=require('multer')
const auth=require('../middleware/auth')
const sharp=require('sharp')
const {sendWelcomemail,cancelationmail}=require("../emails/account")

const app = express();

const router = new express.Router();
app.use(express.json());

router.post("/users", async (req, res) => {
  const user = new User(req.body);
try{
     await user.save()
     sendWelcomemail(user.email,user.name)
     const token= await user.tokenauthkey()
      res.status(201).send({user,token})
    }
catch(e) {
      res.status(404).send();
    }
  
})

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredintials(
      req.body.email,
      req.body.password
    )
    const token = await user.tokenauthkey()
    res.send({user,token})
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;



const nature=multer({
  
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    

    if(!file.originalname.match(/(\.jpg|jpeg|png)$/))
    {
      return cb(new Error('please upload word file'))
    }
    cb(undefined,true)
  }
})

router.post('/nature' ,auth,nature.single( 'nature'),async(req,res)=>{
  const buffer= await sharp(req.file.buffer).resize({width:50,height:50}).png().toBuffer()
  req.user.nature=buffer
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({
    error: error.message
  })
}
)

router.delete('/nature',auth,async(req,res)=>{
  req.user.nature=undefined
  await req.user.save()
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({
    error: error.message
  })})

  router.get('/:id/nature',async(req,res)=>{
    try{
     const user=await User.findById(req.params.id)

     if(!user || !user.nature)
     {
       throw new Error()
     }
     res.set('Content-Type','image/png')
     res.send(user.nature)


    }catch(e)
    {
      res.status(404).send()
    }
  })
