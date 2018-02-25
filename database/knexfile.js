if(process.env.NODE_ENV == 'development' || !process.env.NODE_ENV){
	console.log('Using dotenv for development environment')
	require('dotenv').config({path: '../.env'})
} 

module.exports = {
    
	development: {
		client: 'pg',
		connection: {
			host : process.env.ENV_DB_HOST,
			user : process.env.ENV_DB_USER,
			password : process.env.ENV_DB_USER_PASSWORD,
			database : process.env.ENV_DATABASE
		}
	},

	test: {
		client: 'pg',
		connection: {
			host : process.env.ENV_DB_HOST,
			port: 5432,
			user : process.env.ENV_DB_USER,
			password : process.env.ENV_DB_USER_PASSWORD,
			database : process.env.ENV_DATABASE
		}
	},

	production: {
		client: 'pg',
		connection: {
			host : process.env.ENV_DB_HOST,
			port: 5432,
			user : process.env.ENV_DB_USER,
			password : process.env.ENV_DB_USER_PASSWORD,
			database : process.env.ENV_DATABASE
		}
	}
}
