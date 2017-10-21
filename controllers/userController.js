var express = require('express')
var router = express.Router()
var User = require('../models/user')
var session = require('express-session')

router.get('/login', (req, res) => {

    if (req.session && req.session.user) {
        res.locals.user = req.session.user        
        res.redirect('/')
    } else {
        res.render('user/login')
    }
})

router.post('/login', (req, res) => {

    //Filter shit out of fields against injection
    req.sanitizeBody('username').escape()
    req.sanitizeBody('password').escape()

    var username = req.body.username
    var password = req.body.password

    User.authenticate(username, password, (user, err) => {
        if (user) {
            req.session.user = user
            res.locals.user = req.session.user
            res.redirect('/')
        } else {
            if (err == 'Not approved') {
                res.render('user/login', { 'loginErrorMsg': 'Admin ei ole hyväksynyt rekisteröintiäsi vielä!' })
            } else if (err == "Authentication error") {
                res.render('user/login', { 'loginErrorMsg': 'Virheellinen käyttäjätunnus tai salasana!' })
            } else {
                res.render('user/login', { 'loginErrorMsg': 'Kirjautuminen epäonnistui' })
            }
        }
    })
})

router.get('/register', (req, res) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user        
        res.render('user/register')
    } else {
        res.render('user/login')
    }
})

router.post('/register', (req, res) => {

    req.checkBody('password').isLength({ min: 5, max: 20 }).withMessage('Salasanan tulee olla 5-20 merkkiä pitkä')
    req.checkBody('password').isAlphanumeric().withMessage('Salasana saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('username').isLength({ min: 5, max: 20 }).withMessage('Käyttäjätunnuksen tulee olla 5-20 merkkiä')
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
        res.render('user/register', { errors: errors })
    } else {
        if (password && username && email) {
            if (password == password2) {
                User.register(username, password, email, (err) => {
                    if (err) {
                        console.log('There was an error:', err.code, '\nError detail: ', err.detail)

                        if (err.code == 23505) {
                            res.render('user/register', { 'regErrorMsg': 'Käyttäjätunnus tai sähköposti on jo käytössä!' })
                        } else {
                            res.render('user/register', { 'regErrorMsg': 'Rekisteröinti epäonnistui. Yritä uudestaan!' })
                        }
                    } else {
                        res.render('user/login', { 'regSuccesMsg': 'Rekisteröinti onnistui' })
                    }
                })
            } else {
                res.render('user/register', { 'pwdErrorMsg': 'Salasanat eivät täsmää!' })
            }
        } else {
            res.render('user/register', { 'regErrorMsg': 'Rekisteröinti epäonnistui. Yritä uudestaan!' })
        }
    }
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')
    delete res.locals.user
})


router.get('/user', (req, res) => {
    if (req.session && req.session.user) {
        res.locals.user = req.session.user
        res.render('user/user')
    } else {
        res.redirect('/user/login')
    }
})

router.post('/changePassword', (req, res) => {

    req.checkBody('oldPassword').isLength({ min: 5, max: 20 }).withMessage('Salasanan tulee olla 5-20 merkkiä pitkä')
    req.checkBody('oldPassword').isAlphanumeric().withMessage('Salasana saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('password').isLength({ min: 5, max: 20 }).withMessage('Salasanan tulee olla 5-20 merkkiä pitkä')
    req.checkBody('password').isAlphanumeric().withMessage('Salasana saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('password2').isLength({ min: 5, max: 20 }).withMessage('Salasanan tulee olla 5-20 merkkiä pitkä')
    req.checkBody('password2').isAlphanumeric().withMessage('Salasana saa sisältää vain numeroita ja kirjaimia')

    let errors = req.validationErrors();

    if (errors) {
        console.log(errors)
        res.render('user/user', { errors: errors })
        return
    }

    var username = req.session.user.username
    var oldPassword = req.body.oldPassword
    var password = req.body.password
    var password2 = req.body.password2

    if (!username) return res.redirect('/user/login')
    if (!oldPassword) return res.render('user/user', { oldPwdErrorMsg: "Täytä vanha salasana."})

    User.authenticate(username, password, (err) => {
        if (err) return res.render('user/user', { oldPwdErrorMsg: 'Virheellinen salasana' })
        if (password && password === password2) {
            User.updatePassword(username, password, (err) => {
                if (err) {
                    console.log('There was an error:', err.code, '\nError detail: ', err.detail)
                    errors = [{ "msg": "Jokin meni nyt pieleen. Ota yhteys ylläpitoon, jos ongelma jatkuu." }]
                    res.render('user/user', { errors: errors })
                    return
                }
                res.render('user/user', { 'passwordUpdateMsg': 'Salasana päivitetty!' })
            })
        } else {
            errors = [{"msg": "Salasanat eivät täsmänneet."}]
            res.render('user/user', {errors: errors})
        }
    })
})


    // if (username) {
    //     if(oldPassword) {
    //         User.authenticate(username, password, (err) => {
    //             if(err){
    //                 let errors = 'Virheellinen salasana'
    //                 res.render('user/user', { oldPwdErrorMsg: errors })
    //                 return
    //             }
    //             if (password && password === password2) {
    //                 User.updatePassword(username, password, (err) => {
    //                     if (err) {
    //                         console.log('There was an error:', err.code, '\nError detail: ', err.detail)
    //                         errors = [{ "msg": "Jokin meni nyt pieleen. Ota yhteys ylläpitoon, jos ongelma jatkuu." }]
    //                         res.render('user/user', { errors: errors })
    //                         return
    //                     }                        
    //                     res.render('user/user', { 'passwordUpdateMsg': 'Salasana päivitetty!' })
    //                 })
    //             } else {
    //                 errors = [{"msg": "Salasanat eivät täsmänneet."}]
    //                 res.render('user/user', {errors: errors})
    //             }
    //         })        
    //     } 
    // } else {
    //     res.redirect('/user/login')
    // }
    //})

module.exports = router