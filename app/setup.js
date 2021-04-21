const viewsEngine = require('./views_engine');
const loader = require('./loader');

const setupApplication = async () => {
    // load configuration

    // setup logging

    // load database connection

    viewsEngine.setup();
    loader.loadController('./controller');
};

module.exports = setupApplication;
