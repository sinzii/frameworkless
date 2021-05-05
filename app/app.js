const errorUtils = require('./utils/error');
const requestUtils = require('./utils/request');
const staticFileHandler = require('./static_file_handler');
const router = require('./router');
const logger = require('log4js').getLogger('app');
const httpLogger = require('log4js').getLogger('http');
const { StatusCodes } = require('http-status-codes');
const session = require('./session');

const staticDirs = ['public'];

const requestHandler = async function (req, res) {
    const {method, url} = req;
    httpLogger.debug(`${method} - ${url}`);

    // Serve static files
    const served = staticFileHandler(staticDirs, req, res);
    if (served) {
        return;
    }

    requestUtils.parseRequestUrl(req);
    await requestUtils.parseRequestBody(req);
    await session(req, res);

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

        if (e instanceof FwlError) {
            await e.handleResponse(res);
            return;
        }

        const generalErrMsg = 'There was a problem occurred while processing the request';

        if (req.isRestApiRequest()) {
            res.sendJson({ message: generalErrMsg }, StatusCodes.INTERNAL_SERVER_ERROR);
        } else {
            await errorUtils.sendErrorCode(res, StatusCodes.INTERNAL_SERVER_ERROR, generalErrMsg);
        }
    }
}

module.exports = app;
