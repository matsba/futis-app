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
			SELECT  
					game.id,
					game.team_1, 
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
				(
                    select count(*) from pools
                    join game
                    on game.id = pools.game_id
                    where pools.participant_id = participant.id
                    and pools.pool = game.result
                ) 
                +
                coalesce 
                (
                    (
                        SELECT tournament.ep_top_striker_points_value
                        FROM tournament
                        JOIN extra_pools on extra_pools.participant_id = participant.id
                        WHERE tournament.ep_top_striker_result = extra_pools.top_striker
                	), 0
                )
                +
                coalesce 
                (
                    (
                        SELECT tournament.ep_first_place_points_value
                        FROM tournament
                        JOIN extra_pools on extra_pools.participant_id = participant.id
                        WHERE tournament.ep_first_place_result = extra_pools.first_place
                    ),0
                )
                +
                coalesce 
                (
                    (
                        SELECT tournament.ep_second_place_points_value
                        FROM tournament
                        JOIN extra_pools on extra_pools.participant_id = participant.id
                        WHERE tournament.ep_second_place_result = extra_pools.second_place
                    ), 0
                )
			)
		where tournament_id =  ?`, [tournamentId])
	} catch (error) {
		logger.error('There was an error updating scores: ' + error)
		throw new Error(error)
	}
}

exports.getUserScoresOfTournament = async (tournamentId) => {	
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

exports.getTournamentAggregatedPools = async (tournamentId) => {
	try {
		const results = await db.raw(`
			SELECT game.id, game.team_1, game.team_2, 
			(
				SELECT array_agg(u.username) 
				FROM pools
				JOIN "user" as u
					ON u.id = user_id   
				WHERE game_id = game.id
				AND pool = '1'        
			) 
			as pool_1, 
				(
				SELECT array_agg(u.username) 
				FROM pools
				JOIN "user" as u
					ON u.id = user_id   
				WHERE game_id = game.id
				AND pool = 'x'				
			) 
			as pool_x, 	
			(
				SELECT array_agg(u.username) 
				FROM pools
				JOIN "user" as u
					ON u.id = user_id    
				WHERE game_id = game.id
				AND pool = '2'
			) 
			as pool_2
			FROM tournament
			JOIN game
				ON game.tournament_id = tournament.id
			JOIN participant 
				ON participant.tournament_id = tournament.id
			WHERE tournament.id = ?
			GROUP BY game.id
			ORDER BY game_start_datetime ASC`, [tournamentId])

		let rows = results['rows']

		//Count precentages for pools
		for(let i = 0; i < rows.length; i++){
			//mocked data
			//if(rows[i].pool_1) rows[i].pool_1 = ["Jonah_Sammy","Murphy_Wilbert","Henley_Nath","Edric_Mateo","Phineas_Kyler","John_Jacoby","Salman_Kurt","Vaughn_Gordon","Taylor_Dinesh","Conor_Gus","Storm_Ian","Vlad_Ryker","Perry_Indiana","Alden_Finbar","Prakash_Benjy","Ray_Kellan","Rico_Ayden","Reggie_Kerry","Jersey_Denzel","Rashid_Hector","Reese_Jedediah","Umar_Jerald","Jericho_Morgan","Tyrone_Dayton","Caesar_Langdon","Alex_Koby","Kingsley_Huw","Kit_Wendell","Dmitri_Brogan","Lonnie_Douglas"]
			
			const pool_1 = rows[i].pool_1 ? rows[i].pool_1.length : 0
			const pool_x = rows[i].pool_x ? rows[i].pool_x.length : 0
			const pool_2 = rows[i].pool_2 ? rows[i].pool_2.length : 0
			const summed = pool_1 + pool_x + pool_2

			rows[i].pool_1_percentage = (pool_1 / summed * 100)
			rows[i].pool_x_percentage = (pool_x / summed * 100)
			rows[i].pool_2_percentage = (pool_2 / summed * 100)
		}
		return rows

	} catch (error) {
		logger.error('Error in getTournamentAggregatedPools function: ' + error)
		throw new Error(error)
	}
}

exports.getTournamentExtraPools = async (tournamentId) => {

	try {
		const result = await db.raw(`
			SELECT u.id, username, top_striker, first_place, second_place
			FROM participant
			LEFT JOIN extra_pools
				ON extra_pools.participant_id = participant.id
			JOIN "user" as u
				ON u.id = participant.user_id
			WHERE participant.tournament_id = ?
			`, [tournamentId]
			)

		return result['rows']
	} catch (error) {
		logger.error('Error in getTournamentExtraPools function: ' + error)
		throw new Error(error)
	}

}