const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const viewsEngine = require('./views_engine');
const errorUtils = require('./utils/error');

const ROOT_FOLDER = path.join(__dirname, '/..');

viewsEngine.setup();

const requestHandler = async function (req, res) {
    const {method, url} = req;
    console.log(method, url);

    // TODO: serve static files
    const publicFolder = 'public';
    if (url.startsWith(`/${publicFolder}`)) {
        const targetFile = path.join(ROOT_FOLDER, url);
        fs.readFile(targetFile, function (err, data) {
            if (err) {
                errorUtils.send404Error(res, "File's not found");
                return;
            }

            res.setHeader('Content-Type', mime.contentType(path.extname(targetFile)));
            res.end(data);
        });

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
