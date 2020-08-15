const express = require('express');
const path = require('path');
const DB = require('../Modules/Database');
const { authAdmin } = require('../middleware/auth');
const router = express.Router();

router.get('/', authAdmin, async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/control.html');
    res.sendFile(viewPath);
});

router.post('/reportFounded', async(req, res) =>{
    
    const carID  =req.body.car_id;
    const Stolen = await DB.Is_this_vehicle_stolen(req.body.car_id);
    if(Stolen){
        const result = await DB.report_Stolen_vehicle_founded(carID);
    }
    res.redirect('http://localhost:3000/control/stolenCars');
});

router.get('/stolenCars', authAdmin, async(req, res) => {
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

    }

    res.render('STolen-car', {Number:Number, data:JSON.stringify(data)});
});


module.exports = router;
