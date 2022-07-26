const express = require("express");
const auth = require("../middleware/auth");
require("dotenv").config({ path: '../config/.env' });
const User = require("../model/user");
const { cancelationmail } = require("../emails/account")
const router = new express.Router();
router.use(express.json());



// app.get("/users", (req, res) => {
//   User.find({}).then((users) => {
//     res.send(users);
//   });
// });
router.get("/users/me", auth, (req, res) => {
  console.log(req.user, "::::::getting one")
  res.send(req.user);
});

router.get("/users/logout", auth, async (req, res) => {
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

router.get("/users/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("user logoutAll");
  } catch (e) {
    res.status(401).send(e);
  }
});

router.get("/users/:id", (req, res) => {
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

router.get("/userss/:name", (req, res) => {
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


router.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowupdates = ["id", "name", "email", "password"];
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


router.patch("/users/:id", async (req, res) => {
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


router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }

    res.send(user);
    cancelationmail(req.user.email, req.user.name)
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    console.log(req.user, ":::::::geting in delete")
    await req.user.remove();
    // cancelationmail(req.user.email,req.user.name)
    res.send("req.user");
  } catch (e) {
    res.status(400).send(e);
  }
});



const multer = require('multer');

const upload2 = multer({
  dest: 'images',
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.endsWith('.jpg')) {
      return cb(new Error('please upload pdffile'))
    }
    cb(undefined, true)

    // if(!file.originalname.match(/(\.doc|docx)$/))//regular expression regex101
    // {
    //   return cb(new Error('please upload word file'))
    // }
    // cb(undefined,true)
  }
})
router.post('/upload2', upload2.single('upload2'), (req, res) => {
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  })
}
)
module.exports = router