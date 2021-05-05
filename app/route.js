const { match } = require('path-to-regexp');

function Route(method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
}

const failedMatchResult = [false, null];

Route.prototype.matched =  function (method, path) {
    const matchedMethod = this.method.toLowerCase() === method.toLowerCase();
    if (!matchedMethod) {
        return failedMatchResult;
    }

    const matchResult = match(this.path)(path);

    if (matchResult === false) {
        return failedMatchResult;
    }

    return [true, matchResult.params];
}

module.exports = Route;
