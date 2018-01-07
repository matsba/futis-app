
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function(table){
			table.boolean('winnerbet'),
			table.boolean('topstriker')
		})
	])  
}

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function(table){
			table.dropColumn('winnerbet'),
			table.dropColumn('topstriker')
		})
	])   
}

