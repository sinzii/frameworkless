const config = require('../../config');
const logger = require('log4js').getLogger('setup/db');
const fs = require('fs');
const path = require('path');

let dbClient = null;

const connect = async () => {
    const dbType = config['DB_TYPE'];
    logger.debug(`Connect to database type: ${dbType}`);

    try {
        const isDbSupported = fs.existsSync(path.resolve(__dirname, `./${dbType}.js`));
        if (!isDbSupported) {
            throw new Error(`Db type: ${dbType} is invalid or not supported`);
        }

        const connect = require(`./${dbType}`);
        dbClient = await connect();

        return dbClient;
    } catch (e) {
        logger.error(e.message);
        throw e;
    }
}

const disconnect = async () => {
    if (dbClient == null) {
        return;
    }

    const dbType = config['DB_TYPE'];
    logger.debug(`Disconnect to database type: ${dbType}`);

    if (dbType === 'mongo') {
        if (dbClient.isConnected()) {
            await dbClient.close();
        }
    } else {
        // close postgres connection
    }
}

module.exports = {
    connect,
    disconnect,
    dbClient
};
