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

http.IncomingMessage.prototype.putAttr = function (name, obj) {
    const attrs = this.attrs();

    attrs[name] = obj;
}

http.IncomingMessage.prototype.putAttrs = function (obj) {
    const attrs = this.attrs();

    Object.assign(attrs, obj);
}

http.IncomingMessage.prototype.attrs = function () {
    if (!this._templateAttrs) {
        this._templateAttrs = {};
    }

    return this._templateAttrs;
}

http.IncomingMessage.prototype.putFlashAttr = function (name, obj) {
    const flashAttrs = this.flashAttrs();

    flashAttrs[name] = obj;
}

http.IncomingMessage.prototype.putFlashAttrs = function (obj) {
    const flashAttrs = this.flashAttrs();

    Object.assign(flashAttrs, obj);
}

http.IncomingMessage.prototype.flashAttrs = function () {
    if (!this.session._templateFlashAttrs) {
        this.session._templateFlashAttrs = {};
    }

    return this.session._templateFlashAttrs;
}

http.IncomingMessage.prototype.mergeFlashAttrs = function () {
    const flashAttrs = this.session._templateFlashAttrs;
    if (flashAttrs) {
        const reqAttrs = this.attrs();
        Object.assign(reqAttrs, flashAttrs);

        delete this.session._templateFlashAttrs;
    }
}
