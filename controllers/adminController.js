const express = require('express')
const router = express.Router()
const moment = require('moment')
const User = require('../models/user')
const Tournament = require('../models/tournament')
const Game = require('../models/game')
const session = require('express-session')
const mainHelper = require('../helpers/mainHelper')
const util = require('util')
const { check, validationResult } = require('express-validator/check');

router.get('/gamesManagement', (req, res) => {
    
    if(authenticateAdmin(req)){
        res.locals.user = req.session.user
        res.render('admin/gamesManagement')        
    } else {
        res.redirect('/')
    }    
})

router.get('/userManagement', async (req, res, next) => {

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
            const activeTournaments = await Tournament.getActiveAsync()
            res.render('admin/tournamentManagement', {activeTournaments: activeTournaments})
        } catch (error) {
            req.session.error = 'Tapahtui odottamaton virhe! Päivitä sivu!'
            res.redirect('/')
            delete req.session.error
        }
    } else {
        res.redirect('/')
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

router.post('/createGames', (req, res) => {
    if (!authenticateAdmin(req)) return res.redirect('/')

    req.sanitizeBody('tournamentName').escape()

    req.checkBody('tournamentName').isAlphanumeric().withMessage('Turnauksen nimi saa sisältää vain numeroita ja kirjaimia')
    req.checkBody('numberOfGames').isNumeric()

    var game = {
        tournamentName: req.body.tournamentName,
        numberOfGames: req.body.numberOfGames,
        tournamentPlayingStartDate: req.body.tournamentPlayingStartDate,
        tournamentStartDate: req.body.tournamentStartDate,
        tournamentEndDate: req.body.tournamentEndDate,
        winnerBet: req.body.winnerBet ? true : null,
        topStriker: req.body.topStriker ? true : null,
        numberOfGames: req.body.numberOfGames
    }

    res.render('admin/createGames', {game: game} )
})

router.post('/createGamesSubmit', async (req, res) => {

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

    //If validation errors, render page with errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/gamesManagement', { errors: errors.mapped() });
    }

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

    Game.createGames(gameList)

    //Rederict user to created tournament page
    res.redirect('/tournament/' + tournamentId)
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
        console.log(util.inspect(tournament))
        res.render('admin/tournamentEdit', { tournament })
    } catch (error) {
        res.status(500).send('Internal_server_error')
    } 
})

router.post('/tournament/update', (req, res) => {
    res.json(req.body)
})

function authenticateAdmin(req) {
    return req.session && req.session.user && req.session.user.username == 'admin';
}

module.exports = router