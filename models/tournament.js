var db  = require('../database/db')
var moment = require('moment')
var Game = require('../models/game')

exports.getActiveAsync = (date) => {
    const tournament = db.select('*').from('tournament')
    .where({active: true})
    return tournament
}

//TDOD: get tournament by id

exports.addTournament = async (date) => {    
    try {
        const tournament = db.insert(
            
        )
        
    } catch (error) {
        
    }

}
