var express = require('express')
var router = express.Router()
var User = require('../models/user')
var Tournament = require('../models/tournament')
var session = require('express-session')
var formHelper = require('../helpers/formHelper')
const util = require('util')


router.get('/gamesManagement', (req, res) => {
    
    if(authenticateAdmin(req)){
        res.locals.user = req.session.user
        res.render('admin/gamesManagement')        
    } else {
        res.redirect('/')
    }    
})

router.get('/userManagement', async (req, res, next) => {

    if(authenticateAdmin(req)){
        try {        
            const notApprovedUsers = await User.getUsersAsync(false)    
            const approvedUsers = await User.getUsersAsync(true)               
            res.render('admin/userManagement', {usersToApprove: notApprovedUsers, users: approvedUsers})
        } catch (error) {
            req.session.error = 'Tapahtui odottamaton virhe! Päivitä sivu!'
            res.redirect('/admin/userManagement')
            delete req.session.error
        }      
    } else {
        res.redirect('/')
    }
})

router.get('/tournamentManagement', async (req, res) => {
    if (authenticateAdmin(req)) {
        try {
            const activeTournaments = await Tournament.getActiveAsync()
            res.render('admin/tournamentManagement', {activeTournaments: activeTournaments})
        } catch (error) {
            req.session.error = 'Tapahtui odottamaton virhe! Päivitä sivu!'
            res.redirect('/')
            delete req.session.error
        }
    } else {
        res.redirect('/')
    }
})

router.post('/approveUsers', async (req, res) => {
    if (!authenticateAdmin(req)) return
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
    if (!authenticateAdmin(req)) return
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
    if (!authenticateAdmin(req)) return

    req.sanitizeBody('tournamentName').escape()

    req.checkBody('tournamentName').isAlphanumeric().withMessage('Turnauksen nimi saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('numberOfGames').isNumeric()

    var game = {
        tournamentName: req.body.tournamentName,
        numberOfGames: req.body.numberOfGames,
        tournamentPlayingStartDate: req.body.tournamentPlayingStartDate,
        tournamentStartDate: req.body.tournamentStartDate,
        tournamentEndDate: req.body.tournamentEndDate,
        winnerBet: req.body.winnerBet ? true : null,
        topStriker: req.body.topStriker ? true : null
    }

    res.render('admin/createGames', {game: game} )
})

router.post('/createGamesSubmit', (req, res) => {
    console.log(util.inspect(req.body))
    //TODO: do something with this (sanitize etc)
    var tournament = new Tournament.Tournament(
        req.body.tournamentName,
        req.body.tournamentPlayingStartDate,
        req.body.tournamentStartDate,
        req.body.tournamentEndDate,
        req.body.winnerBet,
        req.body.topStriker
    )

    Tournament.createTournament(tournament)
    res.json(req.body)
})

// TODO: get tournament by id and render page with that tournament
router.get('/tournament/:tournamentId', (req, res) => {
    if (!authenticateAdmin(req)) return

    var tournamentId = req.params.tournamentId
    // MOCKDATA!!!!!
    res.render('admin/tournamentEdit', { tournament: { name:'MockData', id:tournamentId}})
})

function authenticateAdmin(req) {
    return req.session && req.session.user && req.session.user.username == 'admin';
}

module.exports = router