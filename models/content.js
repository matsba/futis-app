const db  = require('../database/db')
const moment = require('moment')
const logger = require('../logger')
const util = require('util')

exports.getPageContent = async (page) => {

    try {
        const infoContent = await db.first('content', 'created')
                            .from('content')
                            .where({page: page})
                            .orderBy('created', 'DESC')
        return infoContent
        
    } catch (error) {
        logger.error("There was an error getting content from database: " + error)
		throw new Error(error)
    }
}

exports.newPageContent = async (page, content, userId) => {

    try {
        const created = await db('content')
                            .insert({
                                creator_user_id: userId, 
                                page: page, 
                                content: content
                            })
        return created

    } catch (error) {
        logger.error("There was an error creating content to database: " + error)
		throw new Error(error)
    }
}