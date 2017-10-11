const express = require('express')
const app = express()
const path = require("path")
var session = require('express-session')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var bcrypt = require('bcryptjs')
var expressValidator = require('express-validator')
var db  = require('./database/db')

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'client')))

app.set('view engine', 'pug')


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }))
  
//Login page and index page
app.get('/', (req, res) => {

    var username = req.session.username

    if(username){
        res.render('index', {'username' : username})
    } else {
        res.render('login')
    }    
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {

    //Filter shit out of fields against injection
    req.sanitizeBody('username').escape()
    req.sanitizeBody('password').escape()

    var username = req.body.username
    var password = req.body.password

    db.select('*').from('users').where({username: username}).then(user => {
        var hash = user[0].password

        if(bcrypt.compareSync(password, hash)){

            if(user[0].approved == true){
                req.session.username = user[0].username
                res.redirect('/')                
            } else {
                res.render('login', {'loginErrorMsg': 'Rekisteröintiäsi ei ole hyväksytty!'})
            }
        } else {
            res.render('login', {'loginErrorMsg': 'Virheellinen käyttäjätunnus tai salasana!'})
        }  
    }).catch(err => {
        res.render('login', {'loginErrorMsg': 'Kirjautuminen epäonnistui'})
    })
})

//Register page
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {

    req.checkBody('password').isLength({min: 5, max: 20}).withMessage('Salasanan tulee olla 5-20 merkkiä pitkä')
    req.checkBody('password').isAlphanumeric().withMessage('Salasana saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('username').isLength({min: 5, max: 20}).withMessage('Käyttäjätunnuksen tulee olla 5-20 merkkiä')
    req.checkBody('username').isAlphanumeric().withMessage('Käyttäjätunnus saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('email').isEmail().withMessage('Sähköposti väärässä muodossa')

    req.sanitizeBody('username').escape()
    req.sanitizeBody('password').escape()
    req.sanitizeBody('password2').escape()

    var errors = req.validationErrors();

    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2
    var email = req.body.email

    if (errors) {
        res.render('register', {errors: errors})
    } else {
        if(password && username && email){
            if(password == password2){

                var salt = bcrypt.genSaltSync(10)
                var hash = bcrypt.hashSync(password, salt)

                db.insert({
                    username: username,	
                    password: hash,	
                    email: email	
                })
                .into('users')
                .on('query-error', (err, obj) => {
                    console.log('Catched error code:', err.code, ' (google more)')
                })
                .then(() => {
                    res.render('login', {'regSuccesMsg': 'Rekisteröinti onnistui'})
                })
                .catch(err => {
                    console.log('Catched error code:', err.code, ' (google more) \nError detail: ', err.detail)
                    if (err.code == 23505) {
                        res.render('register', {'regErrorMsg': 'Käyttäjätunnus tai sähköposti on jo käytössä!'})
                    } else {
                        res.render('register', {'regErrorMsg': 'Rekisteröinti epäonnistui. Yritä uudestaan!'})
                    }
                })
                console.log('Inserting user to database: ' + username)
            } else {
                res.render('register', {'pwdErrorMsg' : 'Salasanat eivät täsmää!'})
            }
        } else {
            res.render('register', {'regErrorMsg': 'Rekisteröinti epäonnistui. Yritä uudestaan!'})
        }
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.get('/admin', (req, res) => {
    var username = req.session.username

    if(username == 'admin'){

        db.select('id', 'username', 'email', 'approved').from('users').where({approved: false}).then(notApprovedUsers => {
            res.render('admin', {userToApprove: notApprovedUsers, username: username})
        })        
    } else {
        res.render('index')
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
            res.redirect('/admin')
        })
    } else {
        res.redirect('/admin')
    }
})

app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})