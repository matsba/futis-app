const winston = require('winston')
const moment = require('moment')
const tsFormat = () => {
    return moment().format('YYYY-MM-DD hh:mm:ss')
  }

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({timestamp: tsFormat}),
		new winston.transports.File({
			filename: 'combined.log',
			level: 'info',
			timestamp: tsFormat
		}),
		new winston.transports.File({
			filename: 'errors.log',
			level: 'error',
			timestamp: tsFormat
		})
	]
})

module.exports = logger