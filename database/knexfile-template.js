module.exports = {
    
      development: {
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