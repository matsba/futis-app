var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var Game = require('../models/game')
var User = require('../models/user')
var Pools = require('../models/pools')
var moment = require('moment')
const util = require('util')

router.get('/tournament/:id', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }
    const tournamentId = req.params.id
    
    try {
        let tournament = await Tournament.getByIdAsync(tournamentId)
        const gamesWithCountryCodes = Game.getCountryCodeForTeams(tournament.games)
        tournament.games = gamesWithCountryCodes;
        res.render('participate/action', {tournament: tournament})
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal_server_error')
    }
})

router.get('/', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }    

    try {
        const activeTournaments = await Tournament.getActiveAsync()
        res.render('participate/index', {activeTournaments: activeTournaments})
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal_server_error')
    }
})

module.exports = router