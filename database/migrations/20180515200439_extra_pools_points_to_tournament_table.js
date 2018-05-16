
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.integer('ep_top_striker_points_value'),
          table.integer('ep_first_place_points_value'),
          table.integer('ep_second_place_points_value')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
            table.dropColumn('ep_top_striker_points_value'),
            table.dropColumn('ep_first_place_points_value'),
            table.dropColumn('ep_second_place_points_value')
        })
      ])
};
