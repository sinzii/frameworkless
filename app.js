const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const ROOT_FOLDER = __dirname;

const app = function(req, res) {
    const { method, url} = req;
    console.log(method, url);

    // TODO: serve static files
    const publicFolder = 'public';
    if (url.startsWith(`/${publicFolder}`)) {
        const targetFile = path.join(ROOT_FOLDER, url);
        console.log(targetFile);
        fs.readFile(targetFile, function(err, data) {
            if (err) {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'text/plain');
                res.end('File not found!');
                return;
            } 
            
            res.setHeader('Content-Type', mime.contentType(targetFile));
            res.end(data);
        });
        
        return;
    }
    

    // TODO: route to specific path

    // TODO: 404 error


    res.setHeader('Content-Type', 'text/html');
    res.end(`
    <!doctype html/>
    <html>
    <head>
        <link rel="stylesheet" type="text/css" href="public/css/style.css"/>
    </head>
    <body>
        <h1>Hello World Haha</h1>
    </body>
    </html>
    `);
}

module.exports = app;