const express = require('express');
const path = require('path');
const user = require('../Modules/user');
const hash = require('../Modules/hash');
const DB = require('../Modules/Database');

const router = express.Router();

router.get('/square', async (req, res) => {
    const obj = {a1: 4, a2: 3, b1:5, b2:5};
    const jsonObj = JSON.stringify(obj);
    res.send(jsonObj);

});

router.post('/signup', async (req, res) => {
    // 1- validate input
    const { error } = user.validate(req.body);
    if (error){
        // handle errors later --------------------------
        return res.send(error.details[0].message);
    }

    const name = req.body.name;
    const ssid = req.body.ssid;
    const carNumber = req.body.car_number;
    const phone = req.body.phone_number;
    const email = req.body.email;
    const password = req.body.password; 
    // 2- validate input from database
    const errors = await DB.new_User(ssid, email, phone_number, car_number);
    if(errors.length != 0) {
        // handle errors later ------------------------------------
        return res.send(errors);
    }
    // 3- hash the password
    const hashedPassword = await hash.hashPassword(password);
    
    // 4-save an account to database
    await DB.Insert_New_Account(ssid,name,email,phone_number,hashedPassword,car_number);
    // 5- go to 'successful registeration' page -------------------------------
    res.send('Successful Signup');
    
});

router.post('/login', async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;

    // 2- validate email from database
    const validEmail = await DB.isValidEmail(email);
    if(!validEmail){
        // handle error ----------------------
        res.send("Email Not found");
    }
    // 3- validate password
    // get pass of this Email and check if valid
    const hashedPassword = await Password_Of_Login(email);
    // compare password
    const validPassword = await hash.isValidPassword(password, hashedPassword);
    if(!validPassword){
        // handle error ----------------------
        res.send("wrong password");
    }

    // 4- go to 'successful registeration' page
    
    res.send('Successful Login');
});

module.exports = router;
