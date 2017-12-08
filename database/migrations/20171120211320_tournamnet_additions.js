
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.boolean('winnerBet'),
          table.boolean('topStriker')
        })
      ])  
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('tournament', function(table){
          table.dropColumn('winnerBet'),
          table.dropColumn('topStriker')
        })
      ])   
};

