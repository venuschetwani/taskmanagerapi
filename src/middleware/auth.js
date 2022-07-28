const jwt = require('jsonwebtoken')
const User = require('../model/user')
require("dotenv").config();


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.decode(token);
        const user = await User.findOne({ '_id': decoded._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token

        next()
    }
    catch (e) {
        res.status(404).send({ error: 'please authenticate' })
    }
}


module.exports = auth