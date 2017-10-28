var express = require('express')
var router = express.Router()
var User = require('../models/user')
var session = require('express-session')
var formHelper = require('../helpers/formHelper')


router.get('/admin', (req, res) => {
    if(req.session && req.session.user && req.session.user.username == 'admin'){
        res.locals.user = req.session.user
        res.render('admin/gamesManagement')        
    } else {
        res.redirect('/')
    }
})

router.get('/gamesManagement', (req, res) => {
    
    if(req.session && req.session.user && req.session.user.username == 'admin'){
        res.locals.user = req.session.user
        res.render('admin/gamesManagement')        
    } else {
        res.redirect('/')
    }    
})

router.get('/userManagement', async (req, res, next) => {

    if(req.session && req.session.user && req.session.user.username == 'admin'){
        try {        
            const notApprovedUsers = await User.getUsersAsync(false)    
            const approvedUsers = await User.getUsersAsync(true)               
            res.render('admin/usermanagement', {usersToApprove: notApprovedUsers, users: approvedUsers})         
        } catch (error) {
            req.session.error = 'Tapahtui odottamaton virhe! Päivitä sivu!'
            res.redirect('/admin/userManagement')
            delete req.session.error
        }      
    } else {
        res.redirect('/')
    }
})

router.post('/approveUsers', async (req, res) => {

    try {
        var users = await formHelper.idsFromForm(req)
        if(users.length < 1){
            req.session.error = 'Ei valittuja käyttäjiä hyväksyttäväksi'
            return res.redirect('/admin/userManagement')
        }
        await User.approveUsersAsync(users)
        res.redirect('/admin/userManagement')
    } catch (error) {
        req.session.error = 'Tapahtui virhe käyttäjien hyväksymisessä! Yritä uudestaan!'
        res.redirect('/admin/userManagement')
        delete req.session.error
    }
})

router.post('/removeUsers', async (req, res) => {

    try {
        var users = await formHelper.idsFromForm(req)
        if(users.length < 1){
            req.session.error = 'Ei valittuja käyttäjiä poistettavaksi'
            return res.redirect('/admin/userManagement')
        }
        await User.removeUsersAsync(users)
        req.session.success = 'Käyttäjä(t) poistettiin!'
        res.redirect('/admin/userManagement')
    } catch (error) {
        req.session.error = 'Tapahtui virhe käyttäjien poistamisessa! Yritä uudestaan!'
        res.redirect('/admin/userManagement')
    }
})

router.post('/createGames', (req, res) => {
    console.log('Got element:')
    console.log(req.body)
})

module.exports = router