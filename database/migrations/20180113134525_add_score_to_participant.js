
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('participant', function (table) {
            table.integer('score')
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('participant', function (table) {
            table.dropColumn('score')
        })
    ])
};
