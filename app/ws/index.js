const WebSocket = require('./ws');
const logger = require('log4js').getLogger('ws');

let wsServer = null;

const bootstrapWebsocketServer = (httpServer) => {
    logger.debug("Bootstrapping WebSocket Server");
    wsServer = new WebSocket(httpServer);
}

module.exports = { bootstrapWebsocketServer, wsServer };
