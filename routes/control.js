const express = require('express');
const path = require('path');
const DB = require('../Modules/Database');

const router = express.Router();

router.get('/', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/control.html');
    res.sendFile(viewPath);
});

router.post('/reportFounded', async(req, res) =>{
});

router.get('/stolenCars', async(req, res) => {
    const cars = await DB.return_stolen_vehicles();
    const Number = cars.length;
    let data = [];
    let owner ; 
    for(let i = 0; i < Number; i++){
        data[i] = [];
        owner = await DB.User_Information(cars[i].vehicle_ID);
        data[i][0] = owner.phone_Number;
        data[i][1] = owner.owner_name;
        data[i][2] = cars[i].vehicle_ID;
        console.log(data[i]);
    }
    // const x = await DB.User_Information(cars[0].vehicle_ID);
    console.log(data);
    res.render('STolen-car', {Number:Number, data:JSON.stringify(data)});
});


module.exports = router;
