var db  = require('../database/db')
var moment = require('moment')
const countryCodes = require('../public/data/countryCodes.json')
//const util = require('util')

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
exports.createGames = (gameList) => {

	/* gameList example:
    { game_start_datetime: '19.11.2017 17:00',
    team_1: 'Alankomaiden Antillit',
    team_2: 'Antarktis',
    tournament_id: '92640ab6-2223-4af3-8de2-0bea4fad88a5' },
    { game_start_datetime: '30.11.2017 19:00',
    team_1: 'Espanja',
    team_2: 'Alankomaat',
    tournament_id: '92640ab6-2223-4af3-8de2-0bea4fad88a5' }  */

	const games = db('game')
		.insert(gameList)
		.then(() => { 
			return games
		})
		.catch(err => {
			throw new Error(err)
		})
}

exports.updateGames = async (gameList) => {
	if (gameList.length < 1) return false;

	try {
		for (let game of gameList) {
			await db('game').where('id', game.id).update(game)
			console.log('Updated game with id ' + game.id)
		}
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

exports.getGames = async (tournamentId) => {
	try {
		const games = await db('game').where('tournament_id', tournamentId).orderBy('game_start_datetime')
		return games
	} catch (error) {
		console.log(error)
		return false
	}
}

//TODO: update game by parameter result, date, team names
