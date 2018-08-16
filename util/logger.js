import winston from 'winston';

export default winston.createLogger({
    transports: [
        (process.env.LOG_DIRECTORY ?
            new (winston.transports.File)({
                filename: process.env.LOG_DIRECTORY + "/tdf-portal-ui.log",
                handleExceptions: true,
                humanReadableUnhandledException: true,
                json: false
            }) : new (winston.transports.Console)({
                handleExceptions: true,
                humanReadableUnhandledException: true
            }))
    ]
});