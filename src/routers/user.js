const express = require("express");
const auth = require("../middleware/auth");
require("dotenv").config({path: '../config/.env'});
const User = require("../model/user");
const app = express();
const user_router = require("./login");
const task_router= require("./task");
const {cancelationmail}=require("../emails/account")

app.use(express.json());
app.use(user_router);
app.use(task_router)

const port = process.env.PORT || 5000;


// app.get("/users", (req, res) => {
//   User.find({}).then((users) => {
//     res.send(users);
//   });
// });
app.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

app.get("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token != req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(401).send();
  }
});

app.get("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("user logoutAll");
  } catch (e) {
    res.status(401).send(e);
  }
});

app.get("/users/:id", (req, res) => {
  const _id = req.params.id;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});

app.get("/userss/:name", (req, res) => {
  const n = req.params.name;
  User.find({ name: n })
    .then((user) => {
      if (!user) {
        return res.status(404).send();
      }

      res.send(user);
    })
    .catch((e) => {
      res.status(500).send(e);
    });
});


app.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdates = [ "id","name", "email", "password"];
  const valid = updates.every((update) => allowupdates.includes(update));
  if (!valid) {
    return res.status(404).send({ error: "invalid" });
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(400).send(e);
  }
});


app.patch("/users/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdate = ["id", "name", "email", "password"];
  const valid = updates.every((update) => allowupdate.includes(update));
  if (!valid) {
    return res.status(404).send({ error: "invalid" });
  }
  try {
    //const user = await User.findByIdAndUpdate(req.params.id, req.body);
    const user = await User.findById(req.params.id);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});


app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    cancelationmail(req.user.email,req.user.name)
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    cancelationmail(req.user.email,req.user.name)
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.listen(port, () => console.log(`express on ${port}`));
console.log(process.env.APP_HOST);

// const taskmodel=require('../model/task')
// const usermodel=require('../model/user')

// const main=async()=>{
//   // const tasks=await taskmodel.findById('62cd1535a5f41c557547681b')
//   // await tasks.populate('owner')
//   // console.log(tasks);


//   // const  user= await usermodel.findById('62cd14a0a5f41c5575476816')
//   // await user.populate('user_task')
//  // console.log(user.user_task);
// }
// main()


const multer=require('multer');

const upload2=multer({
  dest:'images',
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.endsWith('.jpg'))
    {
       return cb(new Error('please upload pdffile'))
    }
    cb(undefined,true)

    // if(!file.originalname.match(/(\.doc|docx)$/))//regular expression regex101
    // {
    //   return cb(new Error('please upload word file'))
    // }
    // cb(undefined,true)
  }
})
app.post('/upload2',upload2.single('upload2'),(req,res)=>{
  res.send()
},(error,req,res,next)=>{
  res.status(400).send({
    error: error.message
  })
}
)