const express = require('express')
const router = express.Router()
const moment = require('moment')
const User = require('../models/user')
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const Pools = require('../models/pools')
const session = require('express-session')
const mainHelper = require('../helpers/mainHelper')
const util = require('util')
const { check, validationResult } = require('express-validator/check')
const logger = require('../logger')

router.get('/gamesManagement', (req, res) => {
    
    if(authenticateAdmin(req)){
        res.locals.user = req.session.user
        res.render('admin/gamesManagement')        
    } else {
        res.redirect('/')
    }    
})

router.get('/userManagement', async (req, res) => {

    if(authenticateAdmin(req)){
        try {        
            const notApprovedUsers = await User.getUsersAsync(false)
            const approvedUsers = await User.getUsersAsync(true)
            res.render('admin/userManagement', {usersToApprove: notApprovedUsers, users: approvedUsers})
        } catch (error) {
            req.session.error = 'Tapahtui odottamaton virhe! Päivitä sivu!'
            res.redirect('/admin/userManagement')
            delete req.session.error
        }      
    } else {
        res.redirect('/')
    }
})

router.get('/tournamentManagement', async (req, res) => {
    if (authenticateAdmin(req)) {
        try {
            const tournaments = await Tournament.getAllAsync(null, null, null, 'datestarts')
            res.render('admin/tournamentManagement', {tournaments: tournaments})
        } catch (error) {
            logger.error(error)
            req.session.error = 'Tapahtui odottamaton virhe! Päivitä sivu!'
            res.redirect('/')
            delete req.session.error
        }
    } else {
        res.redirect('/')
    }
})

// TODO: render error page if cant fetch tournament with given ID!!
router.get('/tournament/:tournamentId', async (req, res) => {
    if (!authenticateAdmin(req)) {
        return res.sendStatus(403)
    }

    const tournamentId = req.params.tournamentId

    try {
        let tournament = await Tournament.getByIdAsync(tournamentId)
        const playingStarts = moment(tournament.datePlayingStarts).format("YYYY-MM-DD")
        const startingDate = moment(tournament.dateStarts).format("YYYY-MM-DD")
        const endingDate = moment(tournament.dateEnds).format("YYYY-MM-DD")
        tournament.datePlayingStarts = playingStarts;
        tournament.dateStarts = startingDate;
        tournament.dateEnds = endingDate;
        res.render('admin/tournamentEdit', { tournament })
    } catch (error) {
        res.status(500).send('Internal_server_error')
    } 
})

router.post('/approveUsers', async (req, res) => {
    if (!authenticateAdmin(req)) return res.redirect('/')
    try {
        var users = await mainHelper.idsFromForm(req)
        if(users.length < 1){
            req.session.error = 'Ei valittuja käyttäjiä hyväksyttäväksi'
            return res.redirect('/admin/userManagement')
        }
        await User.approveUsersAsync(users)
        res.redirect('/admin/userManagement')
    } catch (error) {
        req.session.error = 'Tapahtui virhe käyttäjien hyväksymisessä! Yritä uudestaan!'
        res.redirect('/admin/userManagement')
        delete req.session.error
    }
})

router.post('/removeUsers', async (req, res) => {
    if (!authenticateAdmin(req)) return res.redirect('/')
    try {
        var users = await mainHelper.idsFromForm(req)
        if(users.length < 1){
            req.session.error = 'Ei valittuja käyttäjiä poistettavaksi'
            return res.redirect('/admin/userManagement')
        }
        await User.removeUsersAsync(users)
        req.session.success = 'Käyttäjä(t) poistettiin!'
        res.redirect('/admin/userManagement')
    } catch (error) {
        req.session.error = 'Tapahtui virhe käyttäjien poistamisessa! Yritä uudestaan!'
        res.redirect('/admin/userManagement')
    }
})

router.post('/createGames', async (req, res) => {

    //Incoming request format:
    /*     {
        "tournamentName": "Jalkapallon MM 2018 - Test",
        "tournamentPlayingStartDate": "2017-12-27",
        "tournamentStartDate": "2017-12-28",
        "tournamentEndDate": "2017-12-29",
        "game-datetime": [
          "1.1.2018 21:00",
          "1.1.2018 20:00",
          "1.1.2018 10:00"
        ],
        "team-1": [
          "Alankomaat",
          "Burkina Faso",
          "Etelä-Georgia ja Eteläiset  Sandwichsaaret"
        ],
        "team-2": [
          "d",
          "Arabiemiirikunnat",
          "Armenia"
        ],
        "winnerBet": "on",
        "topStriker": "on"
      } */

    //validate request

    let gameList = []
    const numberOfGames = req.body['team-1'].length

    const tournament = new Tournament.Tournament(
        req.body.tournamentName,
        req.body.tournamentPlayingStartDate,
        req.body.tournamentStartDate,
        req.body.tournamentEndDate,
        req.body.winnerBet,
        req.body.topStriker
    )

    //Creating toournament and this method returns its id
    const tournamentId = await Tournament.createTournamentAsync(tournament)

    //Check if one game
    if(req.body['team-1'] instanceof Array && req.body['team-2'] instanceof Array){
    //Get games from request 
        for(var i = 0; i < numberOfGames; i++){
                gameList.push({
                    game_start_datetime: moment(req.body['game-datetime'][i], "DD.MM.YYYY HH:mm").format(),
                    team_1: req.body['team-1'][i],
                    team_2: req.body['team-2'][i],
                    tournament_id: tournamentId
                }) 
        }
    } else {
        gameList.push({
            game_start_datetime: moment(req.body['game-datetime'], "DD.MM.YYYY HH:mm").format(),
            team_1: req.body['team-1'],
            team_2: req.body['team-2'],
            tournament_id: tournamentId
        })  
    }

    await Game.createGames(gameList)

    //Rederict user to created tournament page
    res.redirect('/tournament/' + tournamentId)
})

router.post('/tournament/update/:id', async (req, res) => {
    if (!authenticateAdmin(req)) {
        return res.sendStatus(403)
    }
    const par = req.body
    
    const tournament = {
        id: req.params.id,
        datestarts: par.tournamentStartDate,
        dateplayingstarts: par.tournamentPlayingStartDate,
        dateends: par.tournamentEndDate,
        name: par.tournamentName
    }

    let games = []


    for (let i = 0; i < par.game_id.length; i++) {
        games.push({
					id: par.game_id[i],
					team_1: par.team_1[i],
					team_2: par.team_2[i],
					game_start_datetime: moment(par.game_datetime[i], "DD.MM.YYYY HH:mm").format()
				})
    }

    const editSuccesful = await Tournament.updateTournamentAsync(tournament)
	const gamesSuccesful = await Game.updateGames(games)

    if (editSuccesful && gamesSuccesful) {
        req.flash('info', 'Turnauksen tiedot päivitetty onnistuneesti')
        req.flash('successful', 'true')
        res.redirect('/admin/tournament/' + tournament.id)
    } else {
        req.flash('info', 'Turnauksen tietojen päivityksessä ongelma, tarkista tiedot')
        req.flash('successful', 'false')
        res.redirect('/admin/tournament/' + tournament.id)
    }
})

router.post('/tournament/toggleStatus/', async (req, res) => {
    if (!authenticateAdmin(req)) {
        return res.sendStatus(403)
    }

    const tournamentId = req.body.id
    const active = req.body.active
    const published = req.body.published

    try {
        await Tournament.updateTournamentAsync({id: tournamentId, active: active, published: published})
        res.sendStatus(200)
    } catch (error) {
        res.sendStatus(500)
    }

})


router.get('/tournament/:id/results', async (req, res) => {
    if (!authenticateAdmin(req)) {
        return res.sendStatus(403)
    }

    const games = await Game.getGames(req.params.id)
    const tournament = await Tournament.getByIdAsync(req.params.id)

    res.render('admin/resultsUpdate', {
        games: games,
        hasWinnerBet: tournament.winnerbet,
        hasTopStriker: tournament.topstriker,
        winner: tournament.winner,
        topStriker: tournament.topstriker
    })
})

router.post('/tournament/:id/results', async (req, res) => {
    if (!authenticateAdmin(req)) {
        return res.sendStatus(403)
    }

    const scores = req.body
    const tournamentId = req.params.id

    let games = []
    let result, teamScore1, teamScore2

    for (let i = 0; i < scores.game_id.length; i++) {

        teamScore1 = scores.goals_1[i]
        teamScore2 = scores.goals_2[i]

        //Check for empty values
        if(!teamScore1.length || !teamScore2.length){
            continue
        }

        if(teamScore1 > teamScore2){
            result = 1
        } else if (teamScore1 < teamScore2) {
            result = 2
        } else if (teamScore1 == teamScore2) {        
            result = 'x'
        } else {
            continue
        }
        
        games.push({
            team_1_score: teamScore1,
            team_2_score: teamScore2,
            id: scores.game_id[i],
            result: result
        })
    }
    try {
        await Game.updateGames(games)
        await Pools.updateTournamentParticipantScoresAsync(tournamentId)    
        res.redirect('')
    } catch (error) {
        //TODO: create info for not succesfull
        next(error)
    }

})

function authenticateAdmin(req) {
    return req.session && req.session.user && req.session.user.username == 'admin';
}

module.exports = router