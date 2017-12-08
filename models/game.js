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

//TODO: add games

exports.createGames = (gameList) => {

    /* gameList example:
    { game_start_datetime: '19.11.2017 17:00',
    team_1: 'Alankomaiden Antillit',
    team_2: 'Antarktis',
    tournament_id: '92640ab6-2223-4af3-8de2-0bea4fad88a5' },
    { game_start_datetime: '30.11.2017 19:00',
    team_1: 'Espanja',
    team_2: 'Alankomaat',
    tournament_id: '92640ab6-2223-4af3-8de2-0bea4fad88a5' }  */

    const games = db('game')
    .insert(gameList)
    .then(() => { 
        return games
    })
    .catch(err => {
        throw new Error(err)
    })
}

//TODO: update game by parameter result, date, team names