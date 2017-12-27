var express = require('express')
var router = express.Router()
const moment = require('moment')
var User = require('../models/user')
var Tournament = require('../models/tournament')
var Game = require('../models/game')
var session = require('express-session')
var formHelper = require('../helpers/formHelper')
const util = require('util')


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
        var users = await formHelper.idsFromForm(req)
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
        var users = await formHelper.idsFromForm(req)
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
    if (!authenticateAdmin(req)) return res.redirect('/')
    //TODO: do something with this (sanitize etc)    	
        /*     {
        "tournamentName": "Nimi",
        "numberOfGames": "2",
        "game-0-datetime": "19.11.2017 17:00",
        "team-0-1": "Alankomaiden Antillit",
        "team-0-2": "Antarktis",
        "game-1-datetime": "30.11.2017 19:00",
        "team-1-1": "d",
        "team-1-2": "Alankomaat",
        "tournamentPlayingStartDate": "2017-12-04",
        "tournamentStartDate": "2017-12-05",
        "tournamentEndDate": "2017-12-06",
        "winnerBet": "true",
        "topStriker": "true"
        } */
    var gameList = []
    const tournament = new Tournament.Tournament(
        req.body.tournamentName,
        req.body.tournamentPlayingStartDate,
        req.body.tournamentStartDate,
        req.body.tournamentEndDate,
        req.body.winnerBet,
        req.body.topStriker
    )
    const numberOfGames = req.body.numberOfGames

    //Creating toournament and getting its id
    const tournamentId = await Tournament.createTournamentAsync(tournament)

    for(var i = 0; i < numberOfGames; i++){
            gameList.push({
                game_start_datetime: req.body["game-"+i+"-datetime"],
                team_1: req.body["team-"+i+"-1"],
                team_2: req.body["team-"+i+"-2"],
                tournament_id: tournamentId
            })
        }

    Game.createGames(gameList)

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

router.post('/tournament/update/:id', (req, res) => {
    if (!authenticateAdmin(req)) {
        return res.sendStatus(403)
    }
    const par = req.body

    const tournament = {
        id: req.params.id,
        dateStarts: par.tournamentStartDate,
        datePlayingStarts: par.tournamentPlayingStartDate,
        dateEnds: par.tournamentEndDate,
        name: par.tournamentName
    }
    const editSuccesful = Tournament.updateTournamentAsync(tournament)

    if (editSuccesful) {
        res.render('admin/tournamentEdit/' + tournament.id, { message: 'Turnauksen tiedot päivitetty onnistuneesti', successful: true })
    } else {
        res.render('admin/tournamentEdit/' + tournament.id, { message: 'Turnauksen tietojen päivitys ei onnistunut', successful: false })
    }

})

function authenticateAdmin(req) {
    return req.session && req.session.user && req.session.user.username == 'admin';
}

module.exports = router