
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('users', function(table){
          table.datetime('dateRegistered')
        })
      ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('users', function(table){
          table.dropColumn('dateRegistered');
        })
      ])
};

//run migrations:
//knex migrate:latest --knexfile database/knexfile.js