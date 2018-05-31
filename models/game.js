const db  = require('../database/db')
const moment = require('moment')
const countryCodes = require('../public/data/countryCodes.json')
const logger = require('../logger')
const util = require('util')

//UTILITES THAT DON'T REQURE DB
const findCode = (team) => {
	var country = countryCodes.find((c) => {
		return c.name == team
	})

	return country ? country.code.toLowerCase() : null
}

exports.getCountryCodeForTeams = (games) => {
	if(!games) return
	//Takes in game object with team_1 and team_2
	//Example
	/*{ team_1: 'Argentiina',
        team_2: 'Kroatia',
        team_1_score: null,
        team_2_score: null,
        result: null,
        game_start_datetime: '2018-06-21T21:00:00+03:00',
        team_1_country_code: AG,
        team_2_country_code: KR }  */

	games.forEach((game) => {
		game.team_1_country_code = findCode(game.team_1)
		game.team_2_country_code = findCode(game.team_2)
	})

	return games
}

exports.filterGamesByDate = (games, date) => {   
	const formatedDate = moment(date).format('YYYY-MM-DD')
	const filtered = games.filter(game => moment(game.game_start_datetime).format('YYYY-MM-DD') == formatedDate)
	return filtered
}

//INCLUDES DB QUERIES
exports.createGames = async (gameList) => {

	/* gameList example:
    { game_start_datetime: '19.11.2017 17:00',
    team_1: 'Alankomaiden Antillit',
    team_2: 'Antarktis',
    tournament_id: '92640ab6-2223-4af3-8de2-0bea4fad88a5' },
    { game_start_datetime: '30.11.2017 19:00',
    team_1: 'Espanja',
    team_2: 'Alankomaat',
    tournament_id: '92640ab6-2223-4af3-8de2-0bea4fad88a5' }  */

	try {
		const games = await db('game').insert(gameList)
		logger.info("Created games: " + games)
		return games
	} catch (error) {
		logget.error('There was an error creating games: ' + error)
		throw new Error(error)
	}
}

exports.updateGames = async (gameList) => {
	if (gameList.length < 1) return false;

	try {
		for (let game of gameList) {
			const prevValue = await db.select('*').from('game').where('id', game.id)
			const newValue = await db('game').where('id', game.id).update(game).returning('*')
			logger.info('Updated game (id: ' + game.id + '). Previous value:' + util.inspect(prevValue) + ' - New value:' + util.inspect(newValue))
		}
		return true
	} catch (error) {
		logger.error("There was an error updating games: " + error)
		throw new Error(error)
	}
}

exports.getGames = async (tournamentId) => {
	try {
		const games = await db('game').where('tournament_id', tournamentId).orderBy('game_start_datetime')
		return games
	} catch (error) {
		logger.error("There was an error getting games from database: " + error)
		throw new Error(error)
	}
}

exports.addGames = async (gameList, tournamentId, earliestNewGame, updateTime) => {
	if (gameList.length < 1) return false;
	
	try {
		await db.insert(gameList).into('game')
		await db('tournament').where('id', tournamentId).update({new_games_first_date: earliestNewGame, new_games_added: updateTime})
		logger.error("Added " + gameList.length + " to tournament with id: " + tournamentId)
		return true
	} catch (error) {
		logger.error("There was an error inserting games to database: " + error)
		throw new Error(error)
	}
}

//TODO: update game by parameter result, date, team names