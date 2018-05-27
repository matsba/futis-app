const db  = require('../database/db')
const moment = require('moment')
const Game = require('../models/game')
const Pools = require('../models/pools')
const User = require('../models/user')
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

exports.getUserParticipatedTournaments = async (userId) => {

    try {
        const tournaments = await db.raw(`
        select tournament.id, name, dateplayingstarts, datestarts, dateends, active, published, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id)
        from tournament
        join participant 
            on tournament.id = participant.tournament_id AND participant.user_id = ?
        and published = true
        order by datestarts desc`, [userId])

        return tournaments['rows']

    } catch (error) {
        logger.error(error)
        throw new Error('getUserParticipatedTournaments failed')
    }
}

exports.getAllAsync = async (active=null, userId=null, published=true, orderby='name') => {
    
    const activeTournaments = (active == true && userId == null && published == true)
    const activeTournamentsWithUserParticipation = (active == true && userId != null && published == true)
    const tournamentsWithUserParticipation = (userId != null && published == true)

    let tournament

    if(activeTournaments) {
        tournament = await db.raw(`
        select id, name, dateplayingstarts, datestarts, dateends, active, published, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id) 
        from tournament
        where active = ?
        and published = ?
        order by ? desc`
        , [active, published, orderby]
        )
    } else if(activeTournamentsWithUserParticipation){
        tournament = await db.raw(`
        select tournament.id, name, dateplayingstarts, datestarts, dateends, active, published, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id), 
            (select true as userparticipated from participant where tournament.id = participant.tournament_id AND participant.user_id = ?)
        from tournament
        where active = ?
        and published = ?
        order by ? desc`, [userId, active, published, orderby]
        )
    } else if (tournamentsWithUserParticipation){
        tournament = await db.raw(`
        select tournament.id, name, dateplayingstarts, datestarts, dateends, active, published, winnerbet, topstriker, 
            (select count(id) as gamesCount from game where game.tournament_id = tournament.id), 
            (select true as userparticipated from participant where tournament.id = participant.tournament_id AND participant.user_id = ?)
        from tournament
        and published = ?
        order by ? desc`, [userId, published, orderby]
        )
    }else {
        tournament = await db.raw(`
        select id, name, dateplayingstarts, datestarts, dateends, active, published, winnerbet, topstriker, 
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
    //Prevents updating id to the database
    //which causes successful update even without other values
    const tournamentId = tournament.id
    tournament.id = undefined

    try {
        await db('tournament').where('id', tournamentId).update(tournament)
        logger.info('Updated tournament with id ' + tournamentId)
        //id back to the referenced 
        tournament.id = tournamentId
        return true
    } catch (error) {
        logger.error(error)
        throw new Error('Update failed')
    }
}

exports.getTournamentViewContent = async (tournamentId, userId) => {
    let tournament = await this.getByIdAsync(tournamentId)
    let user = {}
    
    //enrich data
    if(tournament.games){
        tournament.games = Game.getCountryCodeForTeams(tournament.games)
        tournament.todaysGames = Game.filterGamesByDate(tournament.games, moment().format()) 
        tournament.tomorrowsGames = Game.filterGamesByDate(tournament.games, moment().add(1, 'days').format()) 
        tournament.scores = await Pools.getUserScoresOfTournament(tournamentId)        
        tournament.pools = Game.getCountryCodeForTeams(await Pools.getTournamentAggregatedPools(tournamentId))
        tournament.extraPools = await Pools.getTournamentExtraPools(tournamentId)  
        user.pools = Game.getCountryCodeForTeams(await Pools.getPoolsByUserAndTournamentAsync(userId, tournamentId))
        user.extraPools = await Pools.getExtraPoolsByUserAndTournamentAsync(userId, tournamentId)
        user.userCanParticipate = await User.canPaticipate(tournamentId, userId)             
    }

    return {user, tournament}
}

exports.deleteTournament = async (tournamentId) => {
    try {
        await db('game').where('tournament_id', tournamentId).del()
        await db('tournament').where('id', tournamentId).del()
        return true
    } catch (error) {
        logger.error(error)
        throw new Error('Delete failed')
    }
}