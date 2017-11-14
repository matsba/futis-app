
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('game', function(table){
          table.datetime('game_start_datetime')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('game', function(table){
          table.dropColumn('game_start_datetime')
        })
      ])
};
