var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var Game = require('../models/game')
var User = require('../models/user')
var Pools = require('../models/pools')
var moment = require('moment')
const util = require('util')


router.get('/', async (req, res) => {
    if (req.session && req.session.user) {
        var userId = req.session.user.id

        try {
            const tournamnetId = 'fed06e43-5e24-47f5-ad53-4e8ac238e734'
            const tournament = await Tournament.getByIdAsync(tournamnetId)
            const games = Game.getCountryCodeForTeams(tournament.games)
            const todaysGames = Game.filterGamesByDate(games, '2018-06-20')
            const tomorrowsGames = Game.filterGamesByDate(games, '2018-06-21')            
            const userPools = Game.getCountryCodeForTeams(await Pools.getPoolsByUserAndTournament(userId, tournamnetId))

            res.render('index', {
                tournament: tournament,
                games: games,
                todays: todaysGames,
                tomorrows: tomorrowsGames,
                userPools: userPools
            })

        } catch (error) {
            res.json(error)
        }
    } else {
        res.redirect('/')
    }
})
module.exports = router