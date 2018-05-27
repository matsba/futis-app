
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('user_auth', function(table){
            table.increments('id').notNullable().primary(),
            table.integer('user_id'),
            table.foreign('user_id').references('user.id'),
            table.uuid('allowed_in_tournament')
            table.foreign('allowed_in_tournament').references('tournament.id')
		})
	])  
}

exports.down = function(knex, Promise) {
    return Promise.all([
		knex.schema.dropTable('user_auth')
	])
}