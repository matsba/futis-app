
exports.up = function(knex, Promise) {
    return knex.schema
        .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
        .createTable('user', (table) => {
            table.increments('id').notNullable().primary()
            table.unique('id')
            table.string('username').notNullable()
            table.unique('username')
            table.string('password').notNullable()
            table.string('email').notNullable()
            table.unique('email')
            table.boolean('approved').notNullable().defaultTo(false)
            table.timestamp("dateRegistered").notNullable().defaultTo(knex.fn.now())
        })
        .createTable('tournament', function(table){
              table.uuid('id').defaultTo(knex.raw('uuid_generate_v4()')).primary()
              table.string('name')
              table.datetime('datePlayingStarts')
              table.datetime('dateStarts')
              table.datetime('dateEnds')
              table.boolean('active')
              table.integer('user_id')
              table.foreign('user_id').references('user.id')
            })
        .createTable('participant', function(table){
                table.increments('id').primary()
                table.integer('user_id')
                table.foreign('user_id').references('user.id')
                table.uuid('tournament_id')
                table.foreign('tournament_id').references('tournament.id')
            })
        .createTable('game', function(table){
                table.increments('id').primary()
                table.unique('id')
                table.string('team_1')
                table.string('team_2')
                table.integer('team_1_score')
                table.integer('team_2_score')
                table.string('result', 1)
                table.uuid('tournament_id')
                table.foreign('tournament_id').references('tournament.id')
            })
        .createTable('pools', function(table){
                table.increments('id').primary()
                table.integer('game_id')
                table.foreign('game_id').references('game.id')
                table.integer('user_id')
                table.foreign('user_id').references('user.id')
                table.string('pool', 1)
              })
}

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('participant'),
        knex.schema.dropTable('pools'),
        knex.schema.dropTable('game'),
        knex.schema.dropTable('tournament'),
        knex.schema.dropTable('user')
      ])
};
