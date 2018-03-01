exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function(table){
			table.renameColumn('hidden', 'published')
		})
	])  
}

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function(table){
			table.renameColumn('published', 'hidden')
		})
	])   
}
