const viewsEngine = require('../views_engine');
const loader = require('../loader');
const logger = require('log4js').getLogger('setup');
const db = require('./db');

const setupApplication = async () => {
    logger.debug("Connect database");
    await db.connect();

    logger.debug("Setup view engine");
    viewsEngine.setup();

    logger.debug("Load controllers");
    loader.loadControllers('./controllers');
};

module.exports = setupApplication;
