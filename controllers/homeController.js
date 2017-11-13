var express = require('express')
var router = express.Router()
var Tournament = require('../models/tournament')
var User = require('../models/user')
var moment = require('moment')

router.get('/', async (req, res) => {
    
    try {
        var tournament =  await Tournament.getActiveAsync()
        res.render('index', {tournament: tournament[0]})
    } catch (error) {
        res.json(error)
    } 
})
module.exports = router