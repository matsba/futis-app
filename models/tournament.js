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

exports.getByIdAsync = async (tournamentId) => {
    try {
        const tournament = await db.raw(`select row_to_json(t) as tournament
        from (
            select *, 
            (
                select array_to_json(array_agg(row_to_json(g)))
                from (
                    select team_1, team_2, team_1_score, team_2_score, result
                    from game
                    where tournament_id = tournament.id
                ) g         
                ) as games   
            from tournament
            where id = ?
        ) t`, [tournamentId])

        return tournament['rows'][0]['tournament']

    } catch (error) {
        console.log(error)
    }
}

exports.createTournamentAsync = async (tournament) => {
    try {
        const tournamentId = await db.insert(tournament, 'id').into('tournament')
        console.log('Created new tournament: ' + tournamentId[0])
        return tournamentId[0]
        
    } catch (error) {
        console.log(error)
    }

}
