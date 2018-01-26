const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('express-flash')
const favicon = require('serve-favicon')
//var cookieParser = require('cookie-parser')

const app = express()

app.set('port', (process.env.PORT || 5000))

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use('/easy', express.static(__dirname + '/node_modules/easy-autocomplete/dist/'))

app.set('view engine', 'pug')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.use(session({
	secret: 'epicherokuapp',
	path: '/',
	resave: false,
	saveUninitialized: true
}))

app.use(function(req, res, next){
	res.locals.user = req.session.user
	next()
})

app.use(flash())

//This sends moment to use in views
app.locals.moment = require('moment')
app.locals.moment.locale('fi')
app.use(require('./controllers'))
 
app.listen(app.get('port'), () => {
	console.log('App is running on port ', app.get('port'))
})

app.use(favicon(__dirname + '/public/img/favicon.ico'))