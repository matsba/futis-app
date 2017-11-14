var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var Games = require('../models/game')
var User = require('../models/user')
var moment = require('moment')
const util = require('util')

router.get('/', async (req, res) => {    
    try {

        var tournament =  await Tournament.getActiveAsync()
        var tournamentsGames = await Games.getGamesByTournament(tournament[0].id)
        var todaysGames = await Games.getGamesByDate(tournament[0].id, '2017-12-01')
        var tomorrowsGames = await Games.getGamesByDate(tournament[0].id, '2017-12-02')

        res.render('index', {tournament: tournament[0], 
                            games: tournamentsGames, 
                            todays: todaysGames,
                            tomorrows: tomorrowsGames
                        })
    
    } catch (error) {
        res.json(error)
    } 
})
module.exports = router