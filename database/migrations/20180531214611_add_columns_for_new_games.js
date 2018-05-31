
exports.up = function(knex, Promise) {
    return Promise.all([
		knex.schema.table('tournament', function(table){
			table.datetime('new_games_added'),
			table.datetime('new_games_first_date')
		})
	])  
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.dropColumn('new_games_added')
          table.dropColumn('new_games_first_date')
        })
    ])
};
