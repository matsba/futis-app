var db  = require('../database/db')
var moment = require('moment')

exports.getActiveAsync = (date) => {
    const tournament = db.select('*').from('tournament')
    .where({active: true})
    return tournament
}