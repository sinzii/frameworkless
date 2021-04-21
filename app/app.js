const viewsEngine = require('./views_engine');
const errorUtils = require('./utils/error');
const staticFileHandler = require('./static_file_handler');
const loader = require('./loader');
const router = require('./router');

viewsEngine.setup();
loader.loadController('./controller');

const staticDirs = ['public'];

const requestHandler = async function (req, res) {
    const {method, url} = req;
    console.log(method, url);

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
        console.log(e);
        await errorUtils.sendErrorCode(res, 500, e.message);
    }
}

module.exports = app;
