var express = require('express');
var mongoose = require('./assets/mongoose');
var app = express();

//set up template engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('./public'))

//fire controllers
mongoose(app);

//listen to port
app.listen(5000);
console.log('You are listening to port 5000');