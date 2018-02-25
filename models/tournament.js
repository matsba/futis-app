const db  = require('../database/db')
const moment = require('moment')
const Game = require('../models/game')
const util = require('util')
const logger = require('../logger')

exports.Tournament = class Tournament {

    constructor(name, datePlayingStarts, dateStarts, dateEnds, winnerBet, topStriker) {
        this.name = name,
        this.dateplayingstarts= datePlayingStarts,
        this.datestarts = dateStarts,
        this.dateends = dateEnds,
        this.winnerbet = winnerBet,
        this.topstriker = topStriker
    }
  }

exports.getAllAsync = async (active=null, userId=null, orderby='name') => {
    
    const activeTournaments = (active == true && userId == null)
    const activeTournamentsWithUserParticipation = (active == true && userId != null)

    let tournament

    if(activeTournaments) {
        tournament = await db.raw(`
        select id, name, dateplayingstarts, datestarts, dateends, active, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id) 
        from tournament
        where active = ?
        order by ? desc`
        , [active, orderby]
        )
    } else if(activeTournamentsWithUserParticipation){

        tournament = await db.raw(`
        select tournament.id, name, dateplayingstarts, datestarts, dateends, active, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id), 
            (select true as userparticipated from participant where tournament.id = participant.tournament_id AND participant.user_id = ?)
        from tournament
        where active = ?
        order by ? desc`, [userId, active, orderby]
        )
    } else {
        tournament = await db.raw(`
        select id, name, dateplayingstarts, datestarts, dateends, active, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id) 
        from tournament
        order by ? desc`, [orderby])
    }
    return tournament['rows']
}

exports.getByIdAsync = async (tournamentId) => {
    try {
        const tournament = await db.raw(`select row_to_json(t) as tournament
        from (
            select *, 
            (
                select array_to_json(array_agg(row_to_json(g)))
                from (
                    select id, team_1, team_2, team_1_score, team_2_score, result, game_start_datetime
                    from game
                    where tournament_id = tournament.id
                    order by game_start_datetime asc
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
        logger.info('Created new tournament: ' + tournamentId[0])
        return tournamentId[0]
        
    } catch (error) {
        logger.error(error)
    }
}

exports.updateTournamentAsync = async (tournament) => {
    //Prevents sucess if there are columns that are not in the database
    const tournamentId = tournament.id
    tournament.id = undefined

    console.dir(tournament)

    try {
        await db('tournament').where('id', tournamentId).update(tournament)
        logger.info('Updated tournament with id ' + tournamentId)
        return
    } catch (error) {
        logger.error(error)
        throw new Error('Update failed')
    }
}