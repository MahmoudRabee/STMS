const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', async (req, res) => {
    const viewPath = path.resolve(__dirname, '../view/control.html');
    res.sendFile(viewPath);
});




module.exports = router;
