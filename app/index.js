require('./customization');

const config = require('./config');
const setupApplication = require('./setup');
const http = require('http');
const app = require('./app');
const logger = require('log4js').getLogger('app');
const { bootstrapWebsocketServer } = require('./ws');
const loader = require('./loader');

logger.debug('Load global error classes')
loader.loadModules('./errors');

const bootstrapping = async () => {
    logger.debug('Bootstrapping the server');
    const httpServer = http.createServer(app);
    bootstrapWebsocketServer(httpServer);

    const port = config['HTTP_PORT'] || 3000;
    httpServer.listen(port, function() {
        logger.info(`Server started at http://localhost:${port}`);
    });
}

const startServer = async () => {
    await setupApplication();
    await bootstrapping();
}

module.exports = startServer;
