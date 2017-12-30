const express = require('express')
const router = express.Router()
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const User = require('../models/user')
const Pools = require('../models/pools')
const moment = require('moment')
const util = require('util')


router.get('/:id?', async (req, res) => {
    if (User.authenticateUser(req)) {
        var userId = req.session.user.id

        try {
            const tournaments = (await Tournament.getAllAsync(true))
            let tournamentId = 'fed06e43-5e24-47f5-ad53-4e8ac238e734'//tournaments instanceof Array ? tournaments[0].id : tournaments.id
            if(req.params.id){
                tournamentId = req.params.id
            }
            const tournament = await Tournament.getByIdAsync(tournamentId)
            const games = Game.getCountryCodeForTeams(tournament.games)
            let todaysGames, tomorrowsGames, userPools
            
            if(games){
                todaysGames = Game.filterGamesByDate(games, '2018-06-20') //mock date
                tomorrowsGames = Game.filterGamesByDate(games, '2018-06-21') //mock date         
                userPools = Game.getCountryCodeForTeams(await Pools.getPoolsByUserAndTournament(userId, tournamentId))                
            }

            res.render('index', {
                tournaments: tournaments,
                tournament: tournament,
                games: games || null,
                todays: todaysGames || null,
                tomorrows: tomorrowsGames || null,
                userPools: userPools || null
            })

        } catch (error) {
            res.json(error)
        }
    } else {
        res.redirect('/')
    }
})
module.exports = router