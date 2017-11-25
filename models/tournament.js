var db  = require('../database/db')
var moment = require('moment')
var Game = require('../models/game')
const util = require('util')

exports.Tournament = class Tournament {

    constructor(name, datePlayingStarts, dateStarts, dateEnds, winnerBet, topStriker) {
        this.name = name,
        this.datePlayingStarts= datePlayingStarts,
        this.dateStarts = dateStarts,
        this.dateEnds = dateEnds,
        this.winnerBet = winnerBet,
        this.topStriker = topStriker
    }
  }


exports.getActiveAsync = (date) => {
    const tournament = db.select('*').from('tournament')
    .where({active: true})
    return tournament
}

//TDOD: get tournament by id

exports.createTournament = async (tournament) => {
    try {
        const dbTournament = await db.insert(tournament, 'id').into('tournament')
        const tournamentId = dbTournament[0]
        console.log('Created new tournament: ' + tournamentId)
        
    } catch (error) {
        console.log(error)
    }

}
