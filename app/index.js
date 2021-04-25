// setup logger
require('./config/logger');

const http = require('http')
const app = require('./app');
const setupApplication = require('./setup');
const logger = require('log4js').getLogger('app');
const { bootstrapWebsocketServer } = require('./ws');

const bootstrapping = async () => {
    logger.debug("Bootstrapping the server");
    const httpServer = http.createServer(app);
    bootstrapWebsocketServer(httpServer);

    const port = 3000;
    httpServer.listen(port, function() {
        logger.info(`Server started at http://localhost:${port}`);
    });
}

const startServer = async () => {
    await setupApplication();
    await bootstrapping();
}

module.exports = startServer;
