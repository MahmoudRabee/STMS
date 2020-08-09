const express = require('express');
const path = require('path');
const user = require('../Modules/user');
const hash = require('../Modules/hash');
const DB = require('../Modules/Database');

const router = express.Router();

router.get('/signup', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/signup');
    res.render(viewPath);
});

router.post ('/signup', async(req, res) => {
    let errorMessage = [];

    const name = req.body.name;
    const password = req.body.password;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const car_number = req.body.car_number;
    const ssid = req.body.ssid;

    // 1- validate input
    const { error } = user.validate(req.body);
    if (error){
        // handle errors later --------------------------
        // return res.send(error.details[0].message);
        errorMessage.push(error.details[0].message);
    } else {
        // 2- validate input from database
    const errors = await DB.new_User(ssid, email, phone_number, car_number);
        if(errors.length != 0) {
            // handle errors later ------------------------------------
            // return res.send(errors);
            errorMessage = [...errorMessage, ...errors];
        }
    }
   
    

    if(errorMessage.length != 0) {
        return res.render('signup',{success: false , errors: errorMessage});
    }

    // 3- hash the password
    const hashedPassword = await hash.hashPassword(password);

    // 4-save an account to database
    await DB.Insert_New_Account(ssid,name,email,phone_number,hashedPassword,car_number);
    // 5- go to 'successful registeration' page---------------------------
    res.render('signup',{success: true});
});



router.get('/login', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/login.html');
    res.sendFile(viewPath);
});

router.post ('/login', async(req, res) => {

    const password = req.body.password;
    const email = req.body.email;

    // 2- validate email from database
    const validEmail = await DB.Is_Email_Exist(email);
    if(!validEmail){
        // handle error ----------------------
        return res.send("Email Not found");
    }
    // 3- validate password
    // get pass of this Email and check if valid
    const hashedPassword = await DB.Password_Of_Login(email);
    // compare password
    const validPassword = await hash.isValidPassword(password, hashedPassword);
    if(!validPassword){
        // handle error ----------------------
        return res.send("wrong password");
    }

    // 4- go to 'successful registeration' page
    
    res.send('Successful Login');
    });

module.exports = router;
