const db = require('../database/db')
const moment = require('moment')
const util = require('util')
const logger = require('../logger')

const makePoolsList = (poolsList, userId, participantId) => {

		//poolsList example:
		// {
		// 	'0': { game_id: '1', pool: '1' },
		// 	'1': { game_id: '2', pool: 'x' },
		// 	'2': { game_id: '3', pool: '2' },
		// 	'3': { game_id: '4', pool: '1' },
		// 	'4': { game_id: '5', pool: 'x' },
		// 	'5': { game_id: '6', pool: '2' }
		// }

	let list = []
	for (item of poolsList) {
		item['user_id'] = userId
		item['participant_id'] = participantId
		list.push(item)
	}
	return list
}

exports.getPoolsByUserAndTournamentAsync = async (userId, tournamentId) => {
	
	try {
		const pools = await db.raw(`
			SELECT  game.team_1, 
					game.team_2, 
					game.team_1_score, 
					game.team_2_score, 
					game.result, 
					game.game_start_datetime,
					pools.pool
			from participant as par 
			join tournament as tour 
				on par.tournament_id = tour.id 
			join game 
				on tour.id = game.tournament_id
			left join pools
				on par.id = pools.participant_id and game.id = pools.game_id
			where par.user_id = ? and tour.id = ?
			order by game.game_start_datetime ASC`, [userId, tournamentId])

		return pools['rows']

	} catch (error) {
		logger.error("Error on getPoolsByUserAndTournamentAsync: " + error)
		throw new Error(error)
	}
	
}

exports.getExtraPoolsByUserAndTournamentAsync = async (userId, tournamentId) => {
	
	try {
		const pools = await db.raw(`
			SELECT  
				ep.top_striker,
				ep.first_place,
				ep.second_place
			from participant as par 
			join extra_pools as ep
				on ep.participant_id = par.id
			where par.user_id = ? and par.tournament_id = ?`, [userId, tournamentId])

		return pools['rows'][0]

	} catch (error) {
		logger.error("Error on getPoolsByUserAndTournamentAsync: " + error)
		throw new Error(error)
	}
	
}

exports.userParticipateAsync = async (poolsList, extraPoolsList, userId, tournamentId) => {

	try {
		//Insert user into participant table and return created id
		const participantId = await db.insert({ 'user_id': userId, 'tournament_id': tournamentId }).into('participant').returning('id')
		const id = participantId[0]

		await db.insert(makePoolsList(poolsList, userId, id)).into('pools')

		//extraPoolsList example:
		// {
		// 	topstriker: 'Messi',
		// 	firstplace: 'Italia',
		// 	secondplace: 'Suomi'
		// }

		extraPoolsList['participant_id'] = id

		await db.insert(extraPoolsList).into('extra_pools')

		return true

	} catch (error) {
		logger.error('Error in userParticipateAsync: ' + error)
		throw new Error(error)
	}	
}

exports.updateTournamentParticipantScoresAsync = async(tournamentId) => {
	
	try {
		await db.raw(`update participant
		set score = 
			(
				select count(*) from pools
				join game
				on game.id = pools.game_id
				where pools.participant_id = participant.id
				and pools.pool = game.result
			)
		where tournament_id = ?`, [tournamentId])
	} catch (error) {
		logger.error('There was an error updating scores: ' + error)
		throw new Error(error)
	}
}

exports.getUserScoreOfTournament = async (tournamentId) => {	
	try {
		const userList = await db('participant')
						.join('user', 'user.id', '=', 'participant.user_id')
						.select('user.id', 'user.username', 'participant.score')
						.where({'participant.tournament_id': tournamentId})
						.orderBy('score', 'desc')

		return userList
	} catch (error) {
		logger.error('Error in getUserScoreOfTournament function: ' + error)
		throw new Error(error)
	}
}