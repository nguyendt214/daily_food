#!/usr/bin/env node

require('babel-register')({
    "presets": [
        ["env", {
            "targets": {
                "node": "8.11.3"
            }
        }]
    ]
});

// Module dependencies
var winston = require('winston');
var morgan = require('morgan');
var express = require('express');
var logger = require('./util/logger').default;
var serviceDiscovery = require('./util/service-discovery').default;
var serviceRegistration = require('./util/service-registration').default;
var configDiscovery = require('./util/config-discovery').default;

var app = express();

// DEMO
serviceDiscovery('tdf-portal-api').then(console.log);
configDiscovery().then(console.log);

// Route access logs to file
var accessLogger = winston.createLogger({
    transports: [
        (process.env.ACCESSLOG_DIRECTORY ?
            new (winston.transports.File)({
                filename: process.env.ACCESSLOG_DIRECTORY + "tdf-portal-ui.log",
                handleExceptions: true,
                humanReadableUnhandledException: true,
                json: false
            }) : new (winston.transports.Console)({
                handleExceptions: true,
                humanReadableUnhandledException: true,
                json: false
            }))
    ]
});

accessLogger.stream = { write: message => accessLogger.info(message) };
app.use(morgan("combined", { "stream": accessLogger.stream }));

// Start server and register to consul
var port = process.env.SERVER_PORT || 0;
var server = app.listen(port, onListening);

function onListening() {
    logger.info('Listening at port', server.address().port);
    serviceRegistration(server.address().port)
}
