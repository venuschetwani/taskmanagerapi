const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt =require('jsonwebtoken')
const task=require('../model/task')
require("dotenv").config({path: '../config/.env'});
const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    validate(value) {
      if (value < 18) {
        console.log("id is not accepted");
      }
    },
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("email is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (value.includes("password")) {
        console.log("cant contain password in password");
      }
    },
  },
  tokens:[{
    token:String,
    //required:true
  }],
  nature:{
    type:Buffer
  }
},{
  timestamps:true
});


//relation 
userSchema.virtual('user_task',{
  ref:'Task',
  localField:'_id',
  foreignField:'owner'
})

//plain text to hash password before saving the user
userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
      user.password = await bcrypt.hash(user.password, 8);
    }
    next();
  });
  

  //login confirmation
  userSchema.statics.findByCredintials = async (email, password) => {
  
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("unable to login");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
  
    if (!isMatch) {
      throw new Error("unable to login");
    }
    console.log(user);
       return user
  };

  //token generate

  userSchema.methods.tokenauthkey=async function(){
    const user=this
    const token=jwt.sign({_id:user._id},process.env.JWT_SECRETKEY,{expiresIn: '24h'})
  //console.log(token);
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
  }




  //hiding the data
  userSchema.methods.toJSON=function(){
       const user=this
       const objectUser=user.toObject()

       delete objectUser.password
       delete objectUser.tokens
       delete objectUser.nature

       return objectUser

  }
  

  //delete task when user is deleted
  userSchema.pre('remove',async function(next){
    const user=this;
    await task.deleteMany({owner:user._id})

    next()
  })
  

  const User = new mongoose.model("User", userSchema);
  
  module.exports =User

  




