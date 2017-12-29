const express = require('express')
const router = express.Router()
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const User = require('../models/user')
const Pools = require('../models/pools')
const moment = require('moment')
const util = require('util')


router.get('/', async (req, res) => {
    if (User.authenticateUser(req)) {
        var userId = req.session.user.id

        try {
            const tournamnetId = (await Tournament.getAllAsync(true))[0].id
            const tournament = await Tournament.getByIdAsync(tournamnetId)
            const games = Game.getCountryCodeForTeams(tournament.games)
            const todaysGames = Game.filterGamesByDate(games, '2018-06-20') //mock date
            const tomorrowsGames = Game.filterGamesByDate(games, '2018-06-21') //mock date         
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