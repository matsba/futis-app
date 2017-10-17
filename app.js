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
 


app.get('/admin', (req, res) => {
    var username = req.session.username

    if(username == 'admin'){
        res.redirect('/admin/gamesManagement')    
    } else {
        res.redirect('/')
    }
})

app.get('/admin/gamesManagement', (req, res) => {
    var username = req.session.username

    if(username == 'admin'){
        res.render('admin/gamesManagement', {username: username})     
    } else {
        res.redirect('/')
    }
    
})

app.get('/admin/userManagement', (req, res) => {
    var username = req.session.username

    if(username == 'admin'){
        db.select('id', 'username', 'email', 'dateRegistered', 'approved').from('users').where({approved: false}).then(notApprovedUsers => {
            db.select('id', 'username', 'email', 'dateRegistered', 'approved').from('users').where({approved: true}).andWhereNot({username: 'admin'}).then(users =>{
                res.render('admin/usermanagement', {usersToApprove: notApprovedUsers, users: users, username: username})
            })  
       })
    } else {
        res.redirect('/')
    }
})

app.post('/admin/approveUsers', (req, res) => {

    var idsToApprove = []
    var r = req.body

    for(var key in r){
        if(r[key] == "on"){
            idsToApprove.push(key)
        }
    }

    if(idsToApprove){
        db('users').whereIn('id', idsToApprove).update({approved: true}).on('query-response', function(response, obj, builder) {
            console.log("Approved users with ids: " + idsToApprove)
        }).then(() => {
            res.redirect('/admin/userManagement')
        })
    } else {
        res.redirect('/admin/userManagement')
    }
})

app.post('/admin/removeUsers', (req, res) => {

    var idsToRemove = []
    var r = req.body

    for(var key in r){
        if(r[key] == "on"){
            idsToRemove.push(key)
        }
    }

    if(idsToRemove){
        db('users').whereIn('id', idsToRemove).del().on('query-response', function(response, obj, builder) {
            console.log("Removed users with ids: " + idsToRemove)
        }).then(() => {
            res.redirect('/admin/userManagement')
        })
    } else {
        res.redirect('/admin/userManagement')
    }
})


app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})