const express = require('express')
const router = express.Router()
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const User = require('../models/user')
const Pools = require('../models/pools')
const moment = require('moment')
const util = require('util')

router.get('/tournament/:id', async (req, res) => {
    if (!User.authenticateUser(req) || User.isAdmin(req)) {
        return res.redirect('/')
    }
    const tournamentId = req.params.id
    const userId = req.session.user.id
    
    try {
        let tournament = await Tournament.getByIdAsync(tournamentId)
        tournament.games = Game.getCountryCodeForTeams(tournament.games)
        const userPools = await Pools.getPoolsByUserAndTournamentAsync(userId, tournament.id)
        tournament.userExtraPools = await Pools.getExtraPoolsByUserAndTournamentAsync(userId, tournament.id)

        if(userPools){
            tournament = findBettedGames(tournament, userPools);
        }

        res.render('participate/action', {tournament})
    } catch (error) {
        res.status(500).send('Internal_server_error')
    }
})

router.post('/tournament/do/', async (req, res) => {
    if (!User.authenticateUser(req) || User.isAdmin(req)) {
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

    //Initialize variables
    const tournamentId = req.body.tournament_id
    const userId = req.session.user.id
    let activeTournamentsForUser = {}
    let newPoolsInserted = null
    let insertedPools = null
    const {poolsList, extraPoolsList} = extractPoolsFromRequestBody(req);

       
    //Check user particiption for if new games have been added
    const userParticiapted = await Pools.getPoolsByUserAndTournamentAsync(userId, tournamentId)

    if(userParticiapted){
        const participantId = userParticiapted[0].participantid
        //Insert pools to database
        newPoolsInserted = await Pools.userParticipateAsync(poolsList, extraPoolsList, userId, tournamentId, participantId)
    } else {
        //Insert pools to database
        insertedPools = await Pools.userParticipateAsync(poolsList, extraPoolsList, userId, tournamentId)    
    }

    if(insertedPools || newPoolsInserted){
        try {
            activeTournamentsForUser.tournaments = await Tournament.getAllAsync(true, userId)
            
            // Not needed
            // let participation = true
            // for(obj of tournaments){ 
            //     if(!obj.userparticipated){
            //         participation = false
            //         break
            //     }                    
            // }
            // return participation
            // activeTournamentsForUser['particpatedToAll'] = await particpatedToAll(activeTournamentsForUser.tournaments)   

            res.render('participate/index', {activeTournaments: activeTournamentsForUser, success: {
                text: "Turnaukseen osallistuminen onnistui!"
            }})         
        } catch (error) {
            next(error)
        }     
    } else {
        let tournament = await Tournament.getByIdAsync(tournamentId)
        tournament.games = Game.getCountryCodeForTeams(tournament.games)
        res.render('participate/action', { tournament, error: {
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
        let activeTournamentsForUser = {}
        activeTournamentsForUser['tournaments'] = await Tournament.getAllAsync(true, userId)

        for(let i = 0; i < activeTournamentsForUser['tournaments'].length; i++){
            let tournament = activeTournamentsForUser['tournaments'][i]            
            let userPools = await Pools.getPoolsByUserAndTournamentAsync(userId, tournament.id)
            tournament.games = await Game.getGames(tournament.id)

            tournament.userCanParticipate = await User.canPaticipate(tournament, userId)
            tournament.userHasBettedAllGames = userHasBettedAllGames(tournament, userPools)
        }

        res.render('participate/index', {activeTournaments: activeTournamentsForUser})
    } catch (error) {
        res.status(500).send('Internal_server_error')
    }
})

function extractPoolsFromRequestBody(req) {
    let poolsList = []
    let extraPoolsList = new Object()

    for (let bet in req.body) {
        if (!['top_striker', 'first_place', 'second_place', 'tournament_id'].includes(bet)) {
            poolsList.push({
                'game_id': bet,
                'pool': req.body[bet]
            });
        }
        else if (['top_striker', 'first_place', 'second_place'].includes(bet)) {
            extraPoolsList[bet] = req.body[bet];
        }
    }

    return {poolsList, extraPoolsList}
}

function userHasBettedAllGames(tournament, userPools){
    if(!userPools) return false
    let userHasBettedAllGames = null

    for (let i = 0; i < tournament.games.length; i++) {
        let game = tournament.games[i];

        userPools.find(pool => {
            if (pool.id === game.id & pool.pool !== null) {
                userHasBettedAllGames = true
            } else {
                userHasBettedAllGames = false
                return userHasBettedAllGames
            }
        })
    }
    return userHasBettedAllGames
}

function findBettedGames(tournament, userPools) {
    for (let i = 0; i < tournament.games.length; i++) {
        let game = tournament.games[i];
        userPools.find(pool => {
            if (pool.id === game.id & pool.pool !== null) {
                return game.hasPool = pool.pool;
            }
            else {
                game.hasPool = null;
            }
        });
    }
    return tournament
}

module.exports = router

