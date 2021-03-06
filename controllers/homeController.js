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
        const userId = req.session.user.id

        try {
            const activeTournaments = await Tournament.getAllAsync(true, null, true, 'dateplayingstarts')

            if(activeTournaments.length < 1){
                res.render('notournaments')
            } else {
                //Just need one id
                let tournamentId = activeTournaments instanceof Array ? activeTournaments[0].id : activeTournaments.id
                //Use url parameter if found
                if(req.params.id) tournamentId = req.params.id

                const {user, tournament} = await Tournament.getTournamentViewContent(tournamentId, userId)

                res.render('index', {
                    activeTournaments: activeTournaments,
                    tournament: tournament,
                    currentUser: user,
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