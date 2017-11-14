var db  = require('../database/db')
var moment = require('moment')

exports.getGamesByTournament = (tournamentId) => {
    const games = db
    .select(db.raw("id, team_1 || ' - ' || team_2 as game, team_1_score || ' - ' || team_2_score as score, result, game_start_datetime"))
    .from('game')
    .where({tournament_id: tournamentId})
    return games
}

exports.getGamesByDate = (tournamentId, date) => {
    const games = db
    .select(db.raw("id, team_1 || ' - ' || team_2 as game, team_1_score || ' - ' || team_2_score as score, result, game_start_datetime"))
    .from('game')
    .where({tournament_id: tournamentId}).andWhere(db.raw('game_start_datetime::timestamp::date = ?', date))
    return games
}