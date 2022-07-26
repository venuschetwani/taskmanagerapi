const jwt=require('jsonwebtoken')
const User = require('../model/user')
require("dotenv").config({path: '../config/.env'});


const auth= async(req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer ','')
       console.log(token);
        const decode=jwt.verify(token,process.env.JWT_SECRETKEY)
        console.log(decode);
        //console.log(process.env.JWT_SECRETKEY);
        const user=await User.findOne({'_id':decode._id, 'tokens.token':token})
        if(!user)
        {
            throw new Error()
        }
        
        req.user=user
        req.token=token
        //console.log(req.header('Authorization'));
        next()
    }
    catch(e)
    {
        res.status(404).send({error:'please authenticate'})
    }
}


module.exports=auth