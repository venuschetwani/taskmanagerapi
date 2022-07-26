const request = require('supertest');
const app = require('../src/app')
const User = require('../src/model/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require("dotenv").config({ path: '../src/config/.env' });



const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    id: 78,
    name: 'prince',
    email: 'prince@gamil.com',
    password: 'prince11',
    // tokens: [{
    //     token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRETKEY)
    // }]

}

beforeAll(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

// afterEach(async()=>{
//     await new User(userone).save()
// })




test('should signup new user', async () => {
    await request(app).post('/users').send({

        id: 788,
        name: 'venuss',
        email: 'venuschetwani@gamil.com',
        password: 'venusvv'
    }).expect(201)
})



test('should login ', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
        
    }).expect(200)
})



test('should get the profile', async () => {
  const user=await User.findById(userOne._id)

    const resp = await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${user.tokens[0].token}`)
        .send()
    
        expect(resp.statusCode).toBe(200);
})


test('should delete the account', async () => {
    const user=await User.findById(userOne._id)
    await request(app)
        .delete('/users/me')
        .set('Authorization',  `Bearer ${user.tokens[0].token}`)
        .send()
        .expect(200)
        
})

