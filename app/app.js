const fs = require('fs');
const path = require('path');
const mime = require('mime-types');
const viewsEngine = require('./views_engine');

const ROOT_FOLDER = path.join(__dirname, '/..');

viewsEngine.setup();

const app = async function (req, res) {
    const {method, url} = req;
    console.log(method, url);

    // TODO: serve static files
    const publicFolder = 'public';
    if (url.startsWith(`/${publicFolder}`)) {
        const targetFile = path.join(ROOT_FOLDER, url);
        fs.readFile(targetFile, function (err, data) {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('File not found!');
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

    // TODO: 500 error

    // TODO: 404 error
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Page not found!');
};

module.exports = app;
