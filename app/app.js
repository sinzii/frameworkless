const viewsEngine = require('./views_engine');
const errorUtils = require('./utils/error');
const staticFileHandler = require('./static_file_handler');

viewsEngine.setup();

const staticDirs = ['public'];

const requestHandler = async function (req, res) {
    const {method, url} = req;
    console.log(method, url);

    // Serve static files
    const served = staticFileHandler(staticDirs, req, res);
    if (served) {
        return;
    }

    // TODO: route to specific path
    if (url === '/' || url === '') {
        const index = await viewsEngine.getTemplate('index');

        res.setHeader('Content-Type', 'text/html');

        res.end(index({welcome: 'Hello World'}));

        return;
    }

    // TODO: 404 error
    errorUtils.send404Error(res, "Page's not found!");
};

const app = async (req, res) => {
    try {
        await requestHandler(req, res);
    } catch (e) {
        console.log(e);
        errorUtils.sendErrorCode(res, 500, e.message);
    }
}

module.exports = app;
