
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('extra_pools', function(table){
			table.increments('id').notNullable().primary(),
			table.integer('participant_id'),
			table.foreign('participant_id').references('participant.id'),
			table.string('top_striker'),
			table.string('first_place'),
			table.string('second_place')
		})
	])  
}

exports.down = function(knex, Promise) {
    return Promise.all([
		knex.schema.dropTable('extra_pools')
	])
}
