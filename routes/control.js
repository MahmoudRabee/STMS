const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/control.html');
    res.sendFile(viewPath);
});

router.get('/test', async (req, res) => {
    const obj = {a1: 4, a2: 3, b1:5, b2:5};
    const jsonObj = JSON.stringify(obj);
    res.send(jsonObj);

});


module.exports = router;
