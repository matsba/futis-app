var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var Games = require('../models/game')
var User = require('../models/user')
var Pools = require('../models/pools')
var moment = require('moment')
const util = require('util')

router.get('/', async (req, res) => {
    if (req.session && req.session.user) {
        var userId = req.session.user.id

        try {

            var tournament = await Tournament.getActiveAsync()
            var tournamentsGames = await Games.getGamesByTournament(tournament[0].id)
            var todaysGames = await Games.getGamesByDate(tournament[0].id, '2017-12-01') //mocked date
            var tomorrowsGames = await Games.getGamesByDate(tournament[0].id, '2017-12-02') //mocked date
            var userPools = await Pools.getPoolsByUserAndTournament(userId, '402af448-c275-491e-9f79-511bfe80545b')
            console.log(util.inspect(userPools))
            res.render('index', {
                tournament: tournament[0],
                games: tournamentsGames,
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