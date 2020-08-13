const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.cookies.token || '';
    if(token == ''){
        return res.redirect('http://localhost:3000/user');
    }
    try {
        const carID = jwt.verify(token, 'HSRWas-763R');
        req.carID = carID;
        return next();
    } catch (error) {
        return  res.redirect('http://localhost:3000/user');
    }
}

function authLogin(req, res, next) {
    const token = req.cookies.token || '';
    if(token == ''){
        return next();
    }
    try {
        const carID = jwt.verify(token, 'HSRWas-763R');
        return res.redirect('http://localhost:3000/user/profile');
    } catch (error) {
        return next();
    }
}

function authMobile(req, res, next) {
    const token = req.cookies.token || '';
    if(token == ''){
        return res.redirect('http://localhost:3000/user');
    }
    try {
        const carID = jwt.verify(token, 'HSRWas-763R');
        req.carID = carID;
        return next();
    } catch (error) {
        return  res.redirect('http://localhost:3000/user');
    }
}



module.exports.auth = auth;
module.exports.authLogin = authLogin;