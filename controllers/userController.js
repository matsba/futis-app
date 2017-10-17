var express = require('express')
var router = express.Router()
var User = require('../models/user')
//var auth = require('../middlewares/auth')
var session = require('express-session')

router.get('/login', (req, res) => {

    if (req.session.user.username) {
        res.redirect('/')
    }
    res.render('user/login')
})

router.post('/login', (req, res) => {

    //Filter shit out of fields against injection
    req.sanitizeBody('username').escape()
    req.sanitizeBody('password').escape()

    var username = req.body.username
    var password = req.body.password

    User.authenticate(username, password, (user, err) => {
        if(user){
            req.session.user = user
            res.redirect('/')
        } else {
            if(err == 'Not approved'){
                res.render('user/login', {'loginErrorMsg': 'Admin ei ole hyväksynyt rekisteröintiäsi vielä!'})
            } else if (err == "Authentication error"){
                res.render('user/login', {'loginErrorMsg': 'Virheellinen käyttäjätunnus tai salasana!'})
            } else {
                res.render('user/login', {'loginErrorMsg': 'Kirjautuminen epäonnistui'})
            }
        }
    })
})

router.get('/register', (req, res) => {
    res.render('user/register')
})

router.post('/register', (req, res) => {

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
        res.render('user/register', {errors: errors})
    } else {
        if(password && username && email){
            if(password == password2){
                User.register(username, password, email, (err) => {
                    if(err){
                        console.log('There was an error:', err.code, '\nError detail: ', err.detail)

                        if (err.code == 23505) {
                            res.render('user/register', {'regErrorMsg': 'Käyttäjätunnus tai sähköposti on jo käytössä!'})
                        } else {
                            res.render('user/register', {'regErrorMsg': 'Rekisteröinti epäonnistui. Yritä uudestaan!'})
                        }
                    } else {
                        res.render('user/login', {'regSuccesMsg': 'Rekisteröinti onnistui'})                       
                    }
                })
            } else {
                res.render('user/register', {'pwdErrorMsg' : 'Salasanat eivät täsmää!'})
            }
        } else {
            res.render('user/register', {'regErrorMsg': 'Rekisteröinti epäonnistui. Yritä uudestaan!'})
        }
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
})


//KESKEN
router.get('/user', (req, res) => {
    if (req.session.username) {
        res.render('user/user', {'user': req.session, 'username': req.session.username})
    } else {
        res.redirect('/user/login')
    }
})

router.post('/user', (req, res) => {
    req.checkBody('password').isLength({min: 5, max: 20}).withMessage('Salasanan tulee olla 5-20 merkkiä pitkä')
    req.checkBody('password').isAlphanumeric().withMessage('Salasana saa sisältää vain numeroita ja kirjaimia')

    var errors = req.validationErrors();

    if (errors) {
        console.log(errors)
        res.render('user/user', {'user': req.session, 'username': req.session.username, errors: errors})
        return;
    }

    var username = req.session.username
    var password = req.body.password
    var password2 = req.body.password2

    if (username) {
        if (password && password === password2) {
            var salt = bcrypt.genSaltSync(10)
            var hash = bcrypt.hashSync(password, salt)

            db('users')
                .where({username: username})
                .update({'password': hash})
                .then(console.log('Password updated to database'))
                .catch(err => {
                    console.log('Catched error code:', err.code, ' (google more) \nError detail: ', err.detail)
                    if (err) {
                        errors = [{"msg": "Jokin meni nyt pieleen. Ota yhteys ylläpitoon, jos ongelma jatkuu."}]
                        res.render('user/user', {'user': req.session, 'username': req.session.username, errors: errors})
                    }
                })
            res.render('user/user', {'user': req.session, 'username': req.session.username, 'passwordUpdateMsg': 'Salasana päivitetty!'})
        } else {
            errors = [{"msg": "Salasanat eivät täsmänneet."}]
            res.render('user/user', {'user': req.session, 'username': req.session.username, errors: errors})
        }
    } else {
        res.redirect('/user/login')
    }
})

module.exports = router