var db  = require('../database/db')
var moment = require('moment')

exports.getPoolsByUserAndTournament = (userId, tournamentId) => {
	const pools = db
		.select('g.team_1', 'g.team_2', 'g.team_1_score', 'g.team_2_score', 'g.result', 'g.game_start_datetime',  'p.pool')
		.from('user as u')
		.join('participant as par', 'par.user_id', '=', 'u.id')
		.join('tournament as t', 't.id', '=', 'par.tournament_id')
		.join('game as g', 'g.tournament_id', '=', 't.id')
		.leftJoin('pools as p', function() {
			this.on('p.user_id', '=', 'u.id').andOn('g.id', '=', 'p.game_id')
		})
		.where({
			'u.id': userId,
			't.id': tournamentId
		})
		.orderBy('g.game_start_datetime', 'ASC')
		.on('query-error', function(error, obj) {
			console.log(error);
		})
		.catch((error) => {
			console.log(error)
		})

	return pools 
}



/* SELECT g.team_1, g.team_2, g.team_1_score, g.team_2_score, g.result, g.game_start_datetime,  p.pool FROM "user" as u
JOIN participant as par ON par.user_id = u.id
JOIN tournament as t ON t.id = par.tournament_id
JOIN game as g ON g.tournament_id = t.id
LEFT JOIN pools as p ON p.user_id = u.id AND g.id = p.game_id
WHERE u.id = 102 AND t.id = '402af448-c275-491e-9f79-511bfe80545b'
ORDER BY g.game_start_datetime ASC */