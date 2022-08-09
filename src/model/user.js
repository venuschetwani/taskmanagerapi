require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require('jsonwebtoken')
const task = require('../model/task')

const datenow = new Date()
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
  lastLogin: {
    type: String,
    default: datenow.toLocaleString().replace(',', ' ')
  },
  tokens: [{
    token: String,

  }],
  nature: {
    type: Buffer,
    contentType: String 
  }
}, {
  timestamps: true
});


//relation 
userSchema.virtual('user_task', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
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
    throw new Error("no such user");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("unauthorized");
  }

  return user
};

// //lastlogin
userSchema.statics.lastLogin = async (id) => {
  try {
    
    const user = this;
    const DateNow = new Date()
    const d = DateNow.toLocaleString().replace(',', ' ')
    user=await User.findByIdAndUpdate( id, { lastLogin: d },
      function (err, docs) {
        if (!err) {
          //console.log(docs);
          return user;
        } else {
          //console.error(err);
        }
      })
   
  return user
  } catch (error) {
   //console.error(error);
  }
}




//token generate
userSchema.methods.tokenauthkey = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRETKEY, { expiresIn: '24h' })
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

//checking the expiry token
userSchema.statics.checkTokenExpiry=(token)=>{
  var isExpiredToken=false

  var decoded = jwt.decode(token);
  //console.log(decoded);
    
    var dateNow = new Date();
    
  if (decoded.exp*1000 > dateNow.getTime()) {
    isExpiredToken = false;
   // console.log("not expired")
    
  }
  else{
  isExpiredToken = true;
  //console.log("is expired");
 }
 return isExpiredToken
 }





//hiding the data
userSchema.methods.toJSON = function () {
  const user = this
  const objectUser = user.toObject()

  delete objectUser.password
  delete objectUser.tokens
  delete objectUser.nature

  return objectUser

}


//delete task when user is deleted
userSchema.pre('remove', async function (next) {
  const user = this;
  await task.deleteMany({ owner: user._id })

  next()
})


const User = new mongoose.model("User", userSchema);

module.exports = User






