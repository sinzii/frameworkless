const logger = require('log4js');

logger.configure({
    appenders: {
        console: {
            type: "console"
        },
        dateFile: {
            type: "dateFile",
            filename: "./logs/fwless.log"
        },
        httpRequests: {
            type: "dateFile",
            filename: "./logs/requests.log"
        }
    },
    categories: {
        default: {
            appenders: ["console"],
            level: "debug",
            enableCallStack: true
        },
        http: {
            appenders: ["console", "httpRequests"],
            level: "debug",
        }
    }
});
