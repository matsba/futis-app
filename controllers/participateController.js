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

router.post('/tournament/do/', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }

    //Incoming request example
    //Where numeric properties are game_ids
    //    { 'tournament_id': uuid
    //    '1': '1',
    //   '2': 'x',
    //   '3': '2',
    //   '4': '1',
    //   '5': 'x',
    //   '6': '2',
    //   topstriker: 'Messi',
    //   firstplace: 'Italia',
    //   secondplace: 'Suomi'}

    
    let poolsList = []
    let extraPoolsList = new Object()
    const tournamentId = req.body.tournament_id
    const userId = req.session.user.id

    for(let bet in req.body){
        if(!['top_striker', 'first_place', 'second_place', 'tournament_id'].includes(bet)){
            poolsList.push({
                'game_id': bet,
                'pool': req.body[bet]
            })
        } else if(['top_striker', 'first_place', 'second_place'].includes(bet)) {
            extraPoolsList[bet] = req.body[bet]
        }
    }

    const insertedPools = await Pools.userParticipate(poolsList, extraPoolsList, userId, tournamentId)
    
    if(insertedPools){
        const activeTournaments = await Tournament.getAllAsync(true, userId)        
        res.render('participate/index', {activeTournaments, success: {
            text: "Turnaukseen osallistuminen onnistui!"
        }})
    } else {
        let tournament = await Tournament.getByIdAsync(tournamentId)
        const gamesWithCountryCodes = Game.getCountryCodeForTeams(tournament.games)
        tournament.games = gamesWithCountryCodes;
        res.render('participate/action', {tournament: tournament, error: {
            text: "Tapahtui odottamaton virhe. Yritä uudelleen."
        }})
    }    
})

router.get('/', async (req, res) => {
    if (!User.authenticateUser(req)) {
        return res.redirect('/')
    }    

    const userId = req.session.user.id

    try {
        const activeTournamentsForUser = await Tournament.getAllAsync(true, userId)
        console.log(util.inspect(activeTournamentsForUser))
        res.render('participate/index', {activeTournaments: activeTournamentsForUser})
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal_server_error')
    }
})

module.exports = router