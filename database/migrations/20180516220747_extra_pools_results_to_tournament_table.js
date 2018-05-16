
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.string('ep_top_striker_result'),
          table.string('ep_first_place_result'),
          table.string('ep_second_place_result')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
            table.dropColumn('ep_top_striker_result'),
            table.dropColumn('ep_first_place_result'),
            table.dropColumn('ep_second_place_result')
        })
      ])
};
