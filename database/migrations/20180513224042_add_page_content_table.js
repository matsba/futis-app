
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.createTable('content', function(table){
            table.increments('id').notNullable().primary(),
            table.integer('creator_user_id'),
            table.foreign('creator_user_id').references('user.id'),
            table.string('page'),
            table.text('content'),
            table.timestamp('created').defaultTo(knex.fn.now())
		})
	])  
}

exports.down = function(knex, Promise) {
    return Promise.all([
		knex.schema.dropTable('content')
	])
}