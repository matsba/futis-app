
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.timestamp('ep_result_updated').defaultTo(knex.fn.now())
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
            table.dropColumn('ep_result_updated')
        })
      ])
};
