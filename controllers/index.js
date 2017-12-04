var express = require('express')
var router = express.Router()

router.use('/user', require('./userController'))
router.use('/admin', require('./adminController'))
router.use('/home', require('./homeController'))
router.use('/tournament', require('./tournamentController'))

router.get('/', (req, res) => {
    if(req.session && req.session.user){
        res.redirect('/home/')
    } else {
        res.render('user/login')
    }
})
    

module.exports = router