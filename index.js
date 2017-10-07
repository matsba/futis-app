const express = require('express')
const app = express()
const path = require("path")
var session = require('express-session')
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var db  = require('./database/db');
var bcrypt = require('bcryptjs')

app.set('port', (process.env.PORT || 5000))

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'pug')

app.use(express.static(path.join(__dirname, '..', '..', 'client')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

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
        res.redirect('/login')
    }    
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {

    var username = req.body.username
    var password = req.body.password

    db.select('*').from('users').where({username: username}).then(user => {
        var hash = user[0].password

        if(bcrypt.compareSync(password, hash)){
            req.session.username = user[0].username
            res.redirect('/')                
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
    var username = req.body.username
    var password = req.body.password
    var password2 = req.body.password2
    var email = req.body.email

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
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})

app.listen(app.get('port'), () => {
    console.log('App is running on port ', app.get('port'))
})