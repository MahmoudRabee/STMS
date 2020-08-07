const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const control = require('./routes/control');
const user = require('./routes/user');
const mobile = require('./routes/mobile');
const feature1 = require('./Features/feature1/feature1');
const DB = require('./Modules/Database');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
// const io = require('socket.io')(http);
// const http = require('http').createServer(app);

// connect to database
// DB.Create_STMS_DataBase();
// DB.Create_STMS_tables();

// Routers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/control', control);
app.use('/user', user);
app.use('/mobile', mobile);

// Open socket connection
io.on('connection', (socket) => {
    console.log('connected');

    setInterval(snedCarsNumber, 60000);

    function snedCarsNumber() {
        const {
            roadA1,
            roadA2,
            roadB1,
            roadB2
        } = feature1.carsNumber();
        socket.emit('car numbers', {
            a1: roadA1,
            a2: roadA2,
            b1: roadB1,
            b2: roadB2
        });
    }
});

server.listen(3000, () => {
    console.log('listening on port:3000');
});
