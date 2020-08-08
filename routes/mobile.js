const express = require('express');
const path = require('path');
const user = require('../Modules/user');
const hash = require('../Modules/hash');

const router = express.Router();

router.get('/square', async (req, res) => {
    const obj = {a1: 4, a2: 3, b1:5, b2:5};
    const jsonObj = JSON.stringify(obj);
    res.send(jsonObj);

});

router.post('/signup', async (req, res) => {
    // 1- validate input
    const { error } = user.validate(req.body);
    if (error) return res.send(error.details[0].message);

    const name = req.body.name;
    const ssid = req.body.ssid;
    const carNumber = req.body.car_number;
    const phone = req.body.phone_number;
    const email = req.body.email;
    const password = req.body.password; 
    // 2- validate input from database

    // 3- hash the password
    const hashedPassword = await hash.hashPassword(password);
    res.send('Successful Signup');
    // 4-save an account to database
    // 5- go to 'successful registeration' page

    const body = {
        name: "Mahmoud",
        ssid: ssid,
        carNumber: carNumber,
        phone: phone,
        email: "ahmed",
        password: password
    };
    const stringBody = "Hello Hossam";
    console.log(req.body);
    res.send(stringBody);
});

router.post('/login', async (req, res) => {
    const password = req.body.password;
    const email = req.body.email;

    if(email != 'admin@gmail.com'){
        // res.sendStatus(406);
        console.log('hhhhhhhhhhhh');
        res.send("Email Not found");
    } else if (password != 'admin') {
        // res.status(406);
        console.log('bbbbbbbbb');
        res.send("wrong password"); 
    } else {
        res.send('Successful Login')
    }

        // 2- validate email from database
    
        // 3- validate password
             // get pass of this Email and check if valid
        // const isValidpass = await hash.isValidPassword(password);
    
        // 4- go to 'successful registeration' page
      
        // res.send("hello, World!");
});

module.exports = router;
