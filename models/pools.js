const db = require('../database/db')
const moment = require('moment')
const util = require('util')

exports.getPoolsByUserAndTournament = (userId, tournamentId) => {
	const pools = db
		.select('g.team_1', 'g.team_2', 'g.team_1_score', 'g.team_2_score', 'g.result', 'g.game_start_datetime', 'p.pool')
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
		.on('query-error', function (error, obj) {
			console.log(error);
		})
		.catch((error) => {
			console.log(error)
		})

	return pools
}

exports.userParticipate = async (poolsList, extraPoolsList, userId, tournamentId) => {

	try {
		//Insert user into participant table and return created id
		const participantId = await db.returning('id').insert({ 'user_id': userId, 'tournament_id': tournamentId }).into('participant')
		console.log(participantId)

		//poolsList example:
		// {
		// 	'0': { game_id: '1', pool: '1' },
		// 	'1': { game_id: '2', pool: 'x' },
		// 	'2': { game_id: '3', pool: '2' },
		// 	'3': { game_id: '4', pool: '1' },
		// 	'4': { game_id: '5', pool: 'x' },
		// 	'5': { game_id: '6', pool: '2' }
		// }

		const makePoolsList = (poolsList, userId, participantId) => {
			let list = []
			for (item of poolsList) {
				item['user_id'] = userId
				item['participant_id'] = participantId[0]
				list.push(item)
			}
			return list
		}
		const pools = db.insert(makePoolsList(poolsList, userId, participantId)).into('pools').catch((error) => console.log(error))

		//extraPoolsList example:
		// {
		// 	topstriker: 'Messi',
		// 	firstplace: 'Italia',
		// 	secondplace: 'Suomi'
		// }

		extraPoolsList['participant_id'] = participantId[0]

		const extraPools = db.insert(extraPoolsList).into('extra_pools').catch((error) => console.log(error))

		return true

	} catch (error) {
		console.log(error)
		return false
	}

}



/* SELECT g.team_1, g.team_2, g.team_1_score, g.team_2_score, g.result, g.game_start_datetime,  p.pool FROM "user" as u
JOIN participant as par ON par.user_id = u.id
JOIN tournament as t ON t.id = par.tournament_id
JOIN game as g ON g.tournament_id = t.id
LEFT JOIN pools as p ON p.user_id = u.id AND g.id = p.game_id
WHERE u.id = 102 AND t.id = '402af448-c275-491e-9f79-511bfe80545b'
ORDER BY g.game_start_datetime ASC */