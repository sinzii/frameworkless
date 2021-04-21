const path = require('path');
const fs = require('fs');
const errorUtils = require('./utils/error');
const mime = require('mime-types');

const ROOT_FOLDER = path.join(__dirname, '/..');

const isMatchingStaticDirs = (url, staticDirs) => {
    for (const dir of staticDirs) {
        if (url.startsWith(`/${dir}`)) {
            return true;
        }
    }

    return false;
}

const staticFileHandler = (staticDirs, req, res) => {
    const { url } = req;

    if (!isMatchingStaticDirs(url, staticDirs)) {
        return false;
    }

    const targetFile = path.join(ROOT_FOLDER, url);
    fs.readFile(targetFile, function (err, data) {
        if (err) {
            errorUtils.send404Error(res, "File's not found");
            return;
        }

        res.setHeader('Content-Type', mime.contentType(path.extname(targetFile)));
        res.end(data);
    });

    return true;
}

module.exports = staticFileHandler;
