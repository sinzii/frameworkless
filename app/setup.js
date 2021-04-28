const viewsEngine = require('./views_engine');
const loader = require('./loader');
const logger = require('log4js').getLogger('setup');

const setupApplication = async () => {
    // load configuration

    // load database connection
    logger.debug("Setup view engine");
    viewsEngine.setup();

    logger.debug("Load controllers");
    loader.loadControllers('./controllers');
};

module.exports = setupApplication;
