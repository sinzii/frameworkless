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
    fs.readFile(targetFile, async function (err, data) {
        if (err) {
            await errorUtils.send404Error(res, "File's not found");
            return;
        }

        res.send(data, undefined, mime.contentType(path.extname(targetFile)));
    });

    return true;
}

module.exports = staticFileHandler;
