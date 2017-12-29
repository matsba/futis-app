const express = require('express')
const router = express.Router()
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const User = require('../models/user')
const Pools = require('../models/pools')
const moment = require('moment')
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

router.post('/do/', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }
    res.json(req.body)
})

router.get('/', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }    

    try {
        const activeTournaments = await Tournament.getAllAsync(true)
        res.render('participate/index', {activeTournaments: activeTournaments})
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal_server_error')
    }
})

module.exports = router