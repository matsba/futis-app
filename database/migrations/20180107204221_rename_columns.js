
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function (table) {
			table.renameColumn('winnerBet', 'winnerbet'),
			table.renameColumn('topStriker', 'topstriker'),
			table.renameColumn('datePlayingStarts', 'datelayingstarts'),
			table.renameColumn('dateStarts', 'dateStarts'),
			table.renameColumn('dateEnds', 'dateends')
		})
	])
}

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('users', function (table) {
			table.renameColumn('winnerbet', 'winnerBet'),
			table.renameColumn('topstriker', 'topStriker'),
			table.renameColumn('datelayingstarts', 'datePlayingStarts'),
			table.renameColumn('dateStarts', 'dateStarts'),
			table.renameColumn('dateends', 'dateEnds')
		})
	])
}

