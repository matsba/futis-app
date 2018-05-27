const db  = require('../database/db')
const bcrypt = require('bcryptjs')
const logger = require('../logger')
const moment = require('moment')

var hashPassword = (password) => {
	var salt = bcrypt.genSaltSync(10)
	var hash = bcrypt.hashSync(password, salt)
	return hash
}

exports.register = (username, password, email, callback) => {
	db.insert({
		username: username,	
		password: hashPassword(password),	
		email: email,
	})
		.into('user')
		.then(()=> {
			return callback()
		})
		.catch((err) =>  {
			return callback(err)
		})
}

exports.updatePassword = (username, password, callback) => {
    
	db('user')
		.where({username: username})
		.update({password: hashPassword(password)})
		.then(() => {
			return callback()
		})
		.catch(err => {
			return callback(err)
		})
}

exports.authenticate = (username, password, callback) => {
	db.select('*').from('user').where({ username: username })
		.then(userFromDB => {
			if(userFromDB[0].approved){
				if (bcrypt.compareSync(password, userFromDB[0].password)) {
					var user = {
						id: userFromDB[0].id,
						username: userFromDB[0].username,
						email: userFromDB[0].email,
						dateRegistered: userFromDB[0].dateRegistered
					}
					return callback(user, null)
				} else {
					var err = 'Authentication error'
					return callback(null, err)
				}
			} else {
				err = 'Not approved'
				return callback(null, err)
			}
		})
		.catch((err) => {
			return callback(null, err)
		})
}

exports.getUsersAsync = (approved = true) => {
	const users = db.select('id', 'username', 'email', 'dateRegistered', 'approved')
		.from('user')
		.where({approved: approved})
		.andWhereNot({username: 'admin'})
	return users
}

exports.approveUsersAsync = (idsToApprove) => {
	db('user').whereIn('id', idsToApprove).update({approved: true})
		.catch((err) => {console.log(err)})
}

exports.removeUsersAsync = async (idsToRemove) => {
	try {
		await db('pools').whereIn('user_id', idsToRemove).del()
		await db('participant').whereIn('user_id', idsToRemove).del()
		await db('user').whereIn('id', idsToRemove).del()
		logger.info('Deleted users with ids: ' + idsToRemove)
	} catch (error) {
		logger.error("Error deleting users: " + error)
		throw new Error(error)
	}
	
}

exports.authenticateUser = (req) => {
	return req.session && req.session.user;
}

exports.isAdmin = (req) => {
	if(req.session && req.session.user && req.session.user.username == 'admin'){
		return true
	} else {
		return false
	}
}

exports.canPaticipate = async (tournament, userId) => {
    const now = moment().format()
    const tournamentStarts = moment(tournament.datestarts).format()
	 //tournament comes from active tournaments
    if(tournament.gamescount > 0 && !tournament.userparticipated && await exports.hasPermissionToParticipateForTournament(tournament.id, userId)){
        if(now < tournamentStarts){
            return true
        } /* else if(tournament.newGamesAdded && tournament.newGamesStartDate){
            return true
        } else {
            return false
        } */
    } else {
        return false
	}     
	return false
 }


exports.allHavePermissionToParticipateForTournament = async (tournamentId) => {

	try {
		const users = await db.raw(`select u.id, username, email,
										(select True
										from user_auth
										where allowed_in_tournament = ?
										and user_id = u.id) as "allowed"
									from "user" as u
									where approved = true`, [tournamentId])
		return users['rows']

	} catch (error) {
		logger.error("Error getting users: " + error)
		throw new Error(error)
	}
	
 }

exports.hasPermissionToParticipateForTournament = async (tournamentId, userId) => {

	try {
		const found = await db('user_auth').where({
			'user_id': userId,
			'allowed_in_tournament': tournamentId
		})

		if(found.length > 0){
			return true
		} else {
			return false
		}
	} catch (error) {
		logger.error("Error getting users: " + error)
		throw new Error(error)
	}
	
 }

exports.setUserPermissionsForTournament = async (allowedUsers, notAllowedUsers, tournamentId) => {

	const allowedUsersStr = allowedUsers.toString()
	try {
		await db.raw(`with data(user_id, allowed_in_tournament)  as (
			values ${allowedUsersStr}
		 ) 
		 insert into user_auth (user_id, allowed_in_tournament) 
		 select d.user_id, d.allowed_in_tournament
		 from data d
		 where not exists (select 1
						   from user_auth u2
						   where u2.user_id = d.user_id
						  and u2.allowed_in_tournament = d.allowed_in_tournament)`)
				
		await db('user_auth').whereIn('user_id', notAllowedUsers).andWhere('allowed_in_tournament', tournamentId).del()
		return true

	} catch (error) {
		logger.error("Error setting user permissions: " + error)
		throw new Error(error)
	}

}