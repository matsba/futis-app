var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var Game = require('../models/game')
var User = require('../models/user')
var Pools = require('../models/pools')
var moment = require('moment')
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