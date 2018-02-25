const express = require('express')
const router = express.Router()
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const User = require('../models/user')
const Pools = require('../models/pools')
const moment = require('moment')
const util = require('util')

router.get('/:id', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }    
    
    const tournamentId = req.params.id

    try {
        const tournament = await Tournament.getByIdAsync(tournamentId)
        const games = Game.getCountryCodeForTeams(tournament.games)
        res.render('tournament/details', { tournament: tournament, games: games })
    } catch (error) {
        res.status(500).send('Internal_server_error')
    }    
})

module.exports = router