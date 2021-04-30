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
    this.end(JSON.stringify(data));
}

/**
 * Check if current request is a rest api request which start with /api in the path
 *
 * @returns boolean
 */
http.IncomingMessage.prototype.isRestApiRequest = function () {
    return this.url.startsWith('/api');
}
