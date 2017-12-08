var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var Games = require('../models/game')
var User = require('../models/user')
var Pools = require('../models/pools')
var moment = require('moment')
const util = require('util')

router.get('/:id', async (req, res) => {
    
    const tournamentId = req.params.id

    try {
        var tournament = await Tournament.getByIdAsync(tournamentId)
        res.json(tournament)
    } catch (error) {
        res.status(500).send('Internal_server_error')
    }    

})

module.exports = router