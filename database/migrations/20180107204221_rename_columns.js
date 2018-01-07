
exports.up = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('tournament', function (table) {
			table.renameColumn('winnerBet', 'winnerbet'),
			table.renameColumn('topStriker', 'topstriker'),
			table.renameColumn('datePlayingStarts', 'dateplayingstarts'),
			table.renameColumn('dateStarts', 'datestarts'),
			table.renameColumn('dateEnds', 'dateends')
		})
	])
}

exports.down = function(knex, Promise) {
	return Promise.all([
		knex.schema.table('users', function (table) {
			table.renameColumn('winnerbet', 'winnerBet'),
			table.renameColumn('topstriker', 'topStriker'),
			table.renameColumn('dateplayingstarts', 'datePlayingStarts'),
			table.renameColumn('datestarts', 'dateStarts'),
			table.renameColumn('dateends', 'dateEnds')
		})
	])
}

