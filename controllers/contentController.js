const express = require('express')
const router = express.Router()
const Content = require('../models/content')
const User = require('../models/user')
const logger = require('../logger')
const markdown = require("markdown").markdown;
const sanitizeHtml = require('sanitize-html');


//This will get /info
router.get('/', async (req, res) => {
	if(User.authenticateUser(req)){
        try {
            const content = await Content.getPageContent('info')            
            res.render('info', {info: content })

        } catch (error) {
            console.log(error)
        }		
	} else {
		res.render('user/login', {siteTitle: 'Kirjaudu'})
	}
})

router.post("/new/:page", async (req, res) => {
    if (User.authenticateUser(req) && User.isAdmin(req)) {
        //do not allow script tags and other shinanigans
        const content = sanitizeHtml(req.body.content)

        try {
            const updated = await Content.newPageContent(req.params.page, content, req.session.user.id)
            res.redirect('/content')
        } catch (error) {
            next(error)
        }
    }
    else {
        res.render('user/login', {siteTitle: 'Kirjaudu'})
    }
})

module.exports = router