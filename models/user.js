const db  = require('../database/db')
const bcrypt = require('bcryptjs')
const logger = require('../logger')

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