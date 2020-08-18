const jwt = require('jsonwebtoken');
const { connection } = require('../Modules/Database');
const { car } = require('../Features/feature1/feature1');

function auth(req, res, next) {
    // const token = req.cookies.token || '';
    const token = req.cookies.token;
    // if(token == ''){
    if(!token){
        return res.redirect('http://localhost:3000/user');
        // return res.location('/user');

    }
    try {
        const { isAdmin } = jwt.verify(token, 'HSRWas-763R');
        if(isAdmin){
            return res.redirect('http://localhost:3000/user');
        } else{
            const { carID } = jwt.verify(token, 'HSRWas-763R');
            req.carID = carID;
            return next();
        }

    } catch (error) {
        return  res.redirect('http://localhost:3000/user');
    }
}
function authAdmin(req, res, next) {
    const token = req.cookies.token || '';
    if(token == ''){
        return res.redirect('http://localhost:3000/user');
    }
    try {
        const { isAdmin } = jwt.verify(token, 'HSRWas-763R');
        console.log(`is admin ${isAdmin}`);
        if(isAdmin){
            
            return next();
        } else{
            const { carID } = jwt.verify(token, 'HSRWas-763R');
            req.carID = carID;
            return res.redirect('http://localhost:3000/user');
        }

    } catch (error) {
        return  res.redirect('http://localhost:3000/user');
    }
}

function authLogin(req, res, next) {
    const token = req.cookies.token || '';
    if(token == ''){
        return next();
    }
    // verify token
    try {
        const {carID} = jwt.verify(token, 'HSRWas-763R');
        return res.redirect('http://localhost:3000/user/profile');
    } catch (error) {
        return next();
    }
}

function authMobile(req, res, next) {
    const token = req.headers.authorization || '';
    console.log(token);
    if(token == ''){
        return res.status(401).json({
            mesasge: 'invalid token'
        })
        // return res.send('invalid token');
    }
    try {
        const { carID }= jwt.verify(token, 'HSRWas-763R');
        req.carID = carID;
        return next();
    } catch (error) {
        console.log('catch');
        return res.send('invalid token');
    }
}



module.exports.auth = auth;
module.exports.authLogin = authLogin;
module.exports.authMobile = authMobile;
module.exports.authAdmin = authAdmin;