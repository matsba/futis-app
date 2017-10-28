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

//This sends moment to use in views
app.locals.moment = require('moment');
app.use(require('./controllers'))
 
app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})