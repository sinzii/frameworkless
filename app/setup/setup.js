const viewsEngine = require('../views_engine');
const loader = require('../loader');
const logger = require('log4js').getLogger('setup');
const db = require('./db');

const setupApplication = async () => {
    logger.debug("Connect database");
    await db.connect();

    logger.debug("Load data access objects");
    require('../dao');

    logger.debug("Load business services");
    require('../services');

    logger.debug("Load controllers");
    loader.loadControllers('./controllers');

    logger.debug("Load rest api");
    loader.loadRestApi('./rest_api');

    logger.debug("Setup view engine");
    viewsEngine.setup();
};

module.exports = setupApplication;
