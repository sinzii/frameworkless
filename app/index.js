// setup logger
require('./config/logger');

const http = require('http')
const app = require('./app');
const setupApplication = require('./setup');
const logger = require('log4js').getLogger('app');

const bootstrapping = async () => {
    logger.debug("Bootstrapping the server");
    const server = http.createServer(app);

    const port = 3000;

    server.listen(port, function() {
        console.log(`Server started at http://localhost:${port}`);
    });
}

const startServer = async () => {
    await setupApplication();
    await bootstrapping();
}

module.exports = startServer;
