var db  = require('../database/db')
var moment = require('moment')

exports.getPoolsByUserAndTournament = (userId, tournamentId) => {
    const pools = db.select(db.raw("game.team_1 || ' - ' || game.team_2 as game, game.team_1_score || ' - ' || game.team_2_score as score, game.result, pools.pool"))
        .from('user')
        .innerJoin('participant','participant.user_id' , 'user.id' )
        .innerJoin('tournament', 'tournament.id', 'participant.tournament_id')
        .innerJoin('game', 'game.tournament_id', 'tournament.id')
        .leftJoin('pools', function() {
            this.on('pools.user_id', '=', 'user.id').on('game.id', '=', 'pools.game_id')
        })
        .where({
            'user.id': userId,
            'tournament.id': tournamentId
        })
        .on('query-error', function(error, obj) {
            console.log(error);
        })
        .catch((error) => {
            console.log(error)
        })
        return pools 
}



// SELECT u.*, g.*, p.* FROM "user" as u
// JOIN participant as par ON par.user_id = u.id
// JOIN tournament as t ON t.id = par.tournament_id
// JOIN game as g ON g.tournament_id = t.id
// LEFT JOIN pools as p ON p.user_id = u.id AND g.id = p.game_id
// WHERE u.id = 102 AND t.id = '402af448-c275-491e-9f79-511bfe80545b'