
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('pools', function(table){
			table.integer('participant_id'),
			table.foreign('participant_id').references('participant.id')
		})
	])        
}

exports.down = function(knex, Promise) {
    return Promise.all([
		knex.schema.table('pools', function(table){
			table.dropColumn('participant_id')
		})
	])    
}
