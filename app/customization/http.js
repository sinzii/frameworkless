const http = require('http');

/**
 * Send json to client
 *
 * @param data
 * @param statusCode
 */
http.ServerResponse.prototype.sendJson = function (data, statusCode = 200) {
    this.setHeader('Content-Type', 'application/json');
    this.statusCode = statusCode;

    if (data) {
        this.end(JSON.stringify(data));
    } else {
        this.end();
    }
}
/**
 * Send content with custom content type to client
 *
 * @param content
 * @param statusCode
 * @param contentType
 */
http.ServerResponse.prototype.send = function (content, statusCode = 200, contentType = 'text/html') {
    this.setHeader('Content-Type', contentType);
    this.statusCode = statusCode;
    this.end(content);
}

/**
 * Send an empty response with status code to client
 * @param statusCode
 */
http.ServerResponse.prototype.sendEmpty = function (statusCode = 200) {
    this.statusCode = statusCode;
    this.end();
}

/**
 * Check if current request is a rest api request which start with /api in the path
 *
 * @returns boolean
 */
http.IncomingMessage.prototype.isRestApiRequest = function () {
    return this.url.startsWith('/api');
}
