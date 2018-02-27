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
		const pools = db.select('g.team_1', 'g.team_2', 'g.team_1_score', 'g.team_2_score', 'g.result', 'g.game_start_datetime', 'p.pool')
		.from('user as u')
		.join('participant as par', 'par.user_id', '=', 'u.id')
		.join('tournament as t', 't.id', '=', 'par.tournament_id')
		.join('game as g', 'g.tournament_id', '=', 't.id')
		.leftJoin('pools as p', function () {
			this.on('p.user_id', '=', 'u.id').andOn('g.id', '=', 'p.game_id')
		})
		.where({
			'u.id': userId,
			't.id': tournamentId
		})
		.orderBy('g.game_start_datetime', 'ASC')

		return pools

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

		db.insert(extraPoolsList).into('extra_pools')

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
				and pools.participant_id = participant.id
				and pools.pool = game.result
			)
		where tournament_id = ?`, [tournamentId])
	} catch (error) {
		logger.error('There was an error updating scores: ' + error)
		throw new Error(error)
	}
}