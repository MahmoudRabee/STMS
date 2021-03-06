const cookieSession = require('cookie-session');
const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const control = require('./routes/control');
const user = require('./routes/user');
const mobile = require('./routes/mobile');
const feature1 = require('./Features/feature1/feature1');
const DB = require('./Modules/Database');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// path for template 
const staticPath = path.join(__dirname, './public')
const viewPath = path.join(__dirname,'./view');
// connect to database
DB.connection();

// middleware
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));
app.use(cors());
app.use(cookieParser());
app.use(express.static(staticPath));
app.set('view engine', 'hbs');
app.set('views', viewPath);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routers
app.use('/control', control);
app.use('/user', user);
app.use('/mobile', mobile);

// Open socket connection to send data to control page 
io.on('connection', (socket) => {
    console.log('connected socket');
    
    const socketInterval = setInterval(snedCarsNumber, 1000);
    socket.on('disconnect', () => clearInterval(socketInterval))
    
    function snedCarsNumber() {
        const {
            roadA1,
            roadA2,
            roadB1,
            roadB2
        } = feature1.car.carsNumber;
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
