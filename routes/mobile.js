const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const user = require('../Modules/user');
const hash = require('../Modules/hash');
const DB = require('../Modules/Database');
const feature1 = require('../Features/feature1/feature1');

const router = express.Router();

router.get('/reportStolen', async (req, res) => {
    // console.log(req.body);
    // console.log(req.params);
    console.log(req.headers.authorization);
    // console.log(req.header());
    res.
    res.send('heelo');
});

router.get('/square', async (req, res) => {
    const carsNumber = feature1.car.carsNumber;
    res.send(carsNumber);

});

router.post('/signup', async (req, res) => {
    console.log(req.body);
    const result = {};
    // 1- validate input
    const { error } = user.validate(req.body);
    if (error){
        // handle errors later --------------------------
        result.message = error.details[0].message;
        return res.send(result);
    }

    const name = req.body.name;
    const ssid = req.body.ssid;
    const carNumber = req.body.car_number;
    const phone = req.body.phone_number;
    const email = req.body.email;
    const password = req.body.password; 
    // 2- validate input from database
    const errors = await DB.new_User(ssid, email, phone, carNumber);
    if(errors.length != 0) {
        // handle errors later ------------------------------------
        return res.send(errors);
    }
    // 3- hash the password
    const hashedPassword = await hash.hashPassword(password);
    
    // 4-save an account to database
    await DB.Insert_New_Account(ssid,name,email,phone,hashedPassword,carNumber);
    // 5- go to 'successful registeration' page -------------------------------
    res.send('Successful Signup');
});

router.post('/login', async (req, res) => {
    let result = {};

    const password = req.body.password;
    const email = req.body.email;

    // 2- validate email from database
    const validEmail = await DB.Is_Email_Exist(email);
    if(!validEmail){
        // handle error ----------------------
        // res.send("Email Not found");
        result.message = 'Email Not found';
        return res.send(result);
    }
    // 3- validate password
    // get pass of this Email and check if valid
    const hashedPassword = await DB.Password_Of_Login(email);
    // compare password
    const validPassword = await hash.isValidPassword(password, hashedPassword);
    if(!validPassword){
        // handle error ------------------------
        result.message = 'wrong password';
        return res.send(result);
        // res.send("wrong password");
    }

    // 4- go to 'successful registeration' page
    // res.send('Successful Login');
    const token = jwt.sign({ email: email },'myKey');
    result.message = 'Successful Login';
    result.car_number = 'name';    
    result.name = 'name';
    result.token = token;    
    res.send(result);

});

module.exports = router;
