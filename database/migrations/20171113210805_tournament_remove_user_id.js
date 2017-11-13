
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.dropColumn('user_id')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.integer('user_id')
        })
      ])
};
