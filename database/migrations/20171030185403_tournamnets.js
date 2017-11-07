
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('tournaments', function(table){
          table.string('id').primary()
          table.unique('id')
          table.string('name')
          table.datetime('datePlayingStarts')
          table.datetime('dateStarts')
          table.datetime('dateEnds')
          table.integer('user_id')
          table.foreign('user_id').references('users.id')
        })
    .createTable('users_tournaments', function(table){
            table.increments('id').primary()
            table.integer('user_id')
            table.foreign('user_id').references('users.id')
            table.string('tournament_id')
            table.foreign('tournament_id').references('tournaments.id')
        })
    .createTable('games', function(table){
            table.string('id').primary()
            table.unique('id')
            table.string('team_1')
            table.string('team_2')
            table.integer('result_1')
            table.integer('result_2')
            table.string('final_result')
            table.string('tournament_id')
            table.foreign('tournament_id').references('tournaments.id')
            table.integer('user_id')
            table.foreign('user_id').references('users.id')
        })
    .createTable('users_results', function(table){
            table.increments('id').primary()
            table.integer('user_id')
            table.foreign('user_id').references('users.id')
            table.string('game_id')
            table.foreign('game_id').references('games.id')
            table.string('result')
          })
}

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users_tournaments'),
        knex.schema.dropTable('users_results'),
        knex.schema.dropTable('games'),
        knex.schema.dropTable('tournaments')
      ])
};
