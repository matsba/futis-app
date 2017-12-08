const express = require('express')
const app = express()
const path = require("path")
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var moment = require('moment')

app.set('port', (process.env.PORT || 5000))

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/easy', express.static(__dirname + '/node_modules/easy-autocomplete/dist/'))

app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.use(session({
    secret: 'keyboard cat',
    path: '/',
    resave: false,
    saveUninitialized: true
  }))

app.use(function(req, res, next){
    res.locals.user = req.session.user;
    next();
});

//This sends moment to use in views
app.locals.moment = require('moment');
app.locals.moment.locale('fi')
app.use(require('./controllers'))
 
app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})