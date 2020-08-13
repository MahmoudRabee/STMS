const jwt = require('jsonwebtoken');
const express = require('express');
const path = require('path');
const user = require('../Modules/user');
const hash = require('../Modules/hash');
const DB = require('../Modules/Database');
const {auth, authLogin} = require('../middleware/auth');


const router = express.Router();

// router.get('/signup', async (req, res) => {
//     // const viewPath = path.resolve(__dirname, '../view/signup');
//     res.render('signup');
// });

router.post ('/signup', async(req, res) => {
// temp code 
console.log(req.body);
res.send(req.body);

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



router.get('/', authLogin, async (req, res) => {
    // const viewPath = path.resolve(__dirname, '../view/login.html');
    // res.sendFile(viewPath);
    res.render('login');
});


router.post ('/login', async(req, res) => {
// temp code 
// res.send(req.body)
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
    const carID = await DB.return_vehicle_number(email) //--------------------------------------------------
    console.log(carID);
    const token = jwt.sign({ carID: carID },'HSRWas-763R');
    res.cookie('token', token, {
        expires: new Date(Date.now() + 86400000),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
      return res.redirect('http://localhost:3000/user/profile');
    });

router.get('/profile', auth, (req, res) => {
    res.send("ًWelcome in ypur profile");
});

// ----------------- test routes -----------------------------

router.get('/reverse', auth, (req, res) => {
    res.send("ًWelcome in homepage");
});


router.get('/session', async (req, res) => {
    const token = jwt.sign({id :1234}, 'mysecretKey', {expiresIn:'1h'});
    res.cookie('token', token, {
        expires: new Date(Date.now() + 60000),
        secure: false, // set to true if your using https
        httpOnly: true,
      });
        //   res.status(200).json({token: token});
        res.send(token);

});

router.get('/getsession', async (req, res) => {
    console.log(req.cookies);
    res.send(req.cookies);
});

router.get('/deletesession', async (req, res) => {
    res.cookie('token', '');
    res.send(req.cookies);
});


module.exports = router;
