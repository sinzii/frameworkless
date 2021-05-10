const http = require('http');

/**
 * Check if current request is a rest api request which start with /api in the path
 *
 * @returns boolean
 */
http.IncomingMessage.prototype.isRestApiRequest = function () {
    return this.url.startsWith('/api');
}

/**
 * Get current request protocol which will be http or https
 *
 * @return {*|string}
 */
http.IncomingMessage.prototype.protocol = function () {
    let proto = this.connection.encrypted ? 'https' : 'http';

    return this.headers['x-forwarded-proto'] || proto;
}

/**
 * Get the base url of the request which has format: ${scheme}://${host}
 * Eg: http://localhost:3000, https://frameworkless.com
 * @return {string}
 */
http.IncomingMessage.prototype.baseUrl = function () {
    const host = this.headers['host'];
    return `${this.protocol()}://${host}`;
}


