var express = require('express')
var router = express.Router()
var User = require('../models/user')
var session = require('express-session')

router.use('/user', require('./userController'))
router.use('/admin', require('./adminController'))

router.get('/', (req, res) => {
    if(req.session && req.session.user){
        res.locals.user = req.session.user
        res.render('index')
    } else {
        res.render('user/login')
    }
})
    

module.exports = router