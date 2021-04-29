const viewsEngine = require('../views_engine');
const loader = require('../loader');
const logger = require('log4js').getLogger('setup');
const connect = require('./db');

const setupApplication = async () => {
    logger.debug("Connect database");
    await connect();

    logger.debug("Setup view engine");
    viewsEngine.setup();

    logger.debug("Load controllers");
    loader.loadControllers('./controllers');
};

module.exports = setupApplication;
