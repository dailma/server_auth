// Main Starting Point of Application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express(); //creates our instance of express
const router = require('./router');
const mongoose = require('mongoose');

//DB Setup
mongoose.connect('mongodb://localhost:auth/auth')

//App Setup
//both Morgan and Body Parser are 'middleware' --> app.use registers them.
// Morgan is a 'login' framework
app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);


//Server Setup
const port = process.env.PORT || 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server Listening on: ', port);
