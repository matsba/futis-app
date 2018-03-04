const express = require('express')
const router = express.Router()
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const User = require('../models/user')
const Pools = require('../models/pools')
const moment = require('moment')
const util = require('util')


router.get('/:id?', async (req, res, next) => {
    if (User.authenticateUser(req)) {
        var userId = req.session.user.id

        try {
            const tournaments = await Tournament.getAllAsync(true, null, true, 'dateplayingstarts')
            if(tournaments.length < 1){
                res.render('notournaments')
            } else {
                let tournamentId = tournaments instanceof Array ? tournaments[0].id : tournaments.id
                if(req.params.id){
                    tournamentId = req.params.id
                }
                const tournament = await Tournament.getByIdAsync(tournamentId)
                const games = Game.getCountryCodeForTeams(tournament.games)
                let todaysGames, tomorrowsGames, userPools, userScores

                
                if(games){
                    todaysGames = Game.filterGamesByDate(games, moment().format('YYYY-MM-DD')) 
                    tomorrowsGames = Game.filterGamesByDate(games, moment().add('day').format('YYYY-MM-DD'))          
                    userPools = Game.getCountryCodeForTeams(await Pools.getPoolsByUserAndTournamentAsync(userId, tournamentId)) 
                    userScores = await Pools.getUserScoreOfTournament(tournamentId)               
                }
    
                res.render('index', {
                    tournaments: tournaments,
                    tournament: tournament,
                    games: games || null,
                    todays: todaysGames || null,
                    tomorrows: tomorrowsGames || null,
                    userPools: userPools || null,
                    userScores: userScores || null, 
                    siteTitle: 'Kotisivu'
                })
            }
        } catch (error) {
            next(error)
        }
    } else {
        res.redirect('/')
    }
})
module.exports = router