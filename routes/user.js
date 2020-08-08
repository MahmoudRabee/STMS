const express = require('express');
const path = require('path');
const user = require('../Modules/user');
const hash = require('../Modules/hash');

const router = express.Router();

router.get('/signup', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/signup.html');
    res.sendFile(viewPath);
});

router.post ('/signup', async(req, res) => {
//test 
console.log(req.body);


    // 1- validate input
    const { error } = user.validate(req.body);
    if (error) return res.send(error.details[0].message);

    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const car_number = req.body.car_number;
    const ssid = req.body.ssid;
    
    // 2- validate input from database

    // 3- hash the password
    const hashedPassword = await hash.hashPassword(password);

    // 4-save an account to database
    // 5- go to 'successful registeration' page
    res.send(req.body);
});

router.get('/login', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/login.html');
    res.sendFile(viewPath);
});

router.post ('/login', async(req, res) => {

        const password = req.body.password;
        const email = req.body.email;

        // 2- validate email from database
    
        // 3- validate password
             // get pass of this Email and check if valid
        const isValidpass = await hash.isValidPassword(password);
    

        // 4- go to 'successful registeration' page
      
        res.send(req.body);
    });

module.exports = router;
