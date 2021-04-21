const errorUtils = require('./utils/error');
const staticFileHandler = require('./static_file_handler');
const router = require('./router');
const logger = require('log4js').getLogger('app');
const httpLogger = require('log4js').getLogger('http');

const staticDirs = ['public'];

const requestHandler = async function (req, res) {
    const {method, url} = req;
    httpLogger.debug(`${method} - ${url}`);

    // Serve static files
    const served = staticFileHandler(staticDirs, req, res);
    if (served) {
        return;
    }

    // detect route and serve
    const route = router.getMatchedRoute(req);
    if (route) {
        await route.handler(req, res);
    } else {
        await errorUtils.send404Error(res, "Page's not found!");
    }
};

const app = async (req, res) => {
    try {
        await requestHandler(req, res);
    } catch (e) {
        logger.error(e);
        await errorUtils.sendErrorCode(res, 500, e.message);
    }
}

module.exports = app;
