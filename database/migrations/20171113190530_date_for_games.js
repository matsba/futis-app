
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('game', function(table){
          table.datetime('startDateAndTime')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('game', function(table){
          table.dropColumn('startDateAndTime')
        })
      ])
};
