const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const ejs = require('ejs');
const engine = require('ejs-mate');
const fileUpload = require('express-fileupload');


var app = express();

mongoose.connect('mongodb+srv://psoni1186:psony1186@cluster0-wnlds.mongodb.net/test',function(err){
  if(err){
    console.log(err);
  }else{
    console.log('connected to db');
  }
})

//middleware
app.use(fileUpload());
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine','ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(morgan('dev'));


require('./routes/main')(app);
require('./routes/pins')(app);

app.listen(8090,function(err){
  if(err){
    console.log(err);
  }else{
    console.log('server started');
  }
})
