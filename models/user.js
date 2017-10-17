var db  = require('../database/db')
var bcrypt = require('bcryptjs')

hashPassword = (password) => {
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
    .into('users')
    .then(()=> {
        console.log('Inserted user to database: ' + username)
        return callback()
    })
    .catch((error) =>  {
        return callback(error)
    })
}

exports.authenticate = (username, password, callback) => {
    db.select('*').from('users').where({ username: username })
    .then(userFromDB => {
        if(userFromDB[0].approved){
            if (bcrypt.compareSync(password, userFromDB[0].password)) {
                user = {
                    username: userFromDB[0].username,
                    email: userFromDB[0].email
                }
                return callback(user, null)
            } else {
                var err = "Authentication error"
                return callback(null, err)
            }
        } else {
            var err = "Not approved"
            return callback(null, err)
        }
    })
    .catch((err) => {
        return callback(null, err)
    })
}