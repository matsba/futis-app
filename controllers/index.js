var express = require('express')
var router = express.Router()

router.use('/user', require('./userController'))
router.use('/admin', require('./adminController'))
router.use('/home', require('./homeController'))
router.use('/tournament', require('./tournamentController'))
router.use('/participate', require('./participateController'))
router.use('/content', require('./contentController'))
router.use('/info', require('./contentController'))

router.get('/', (req, res) => {
	if(req.session && req.session.user){
		res.redirect('/home/')
	} else {
		res.render('user/login', {siteTitle: 'Kirjaudu'})
	}
})

module.exports = router