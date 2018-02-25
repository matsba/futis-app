exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function(table){
			table.boolean('hidden')
		})
	])  
}

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function(table){
			table.dropColumn('hidden')
		})
	])   
}
