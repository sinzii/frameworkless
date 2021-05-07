const { match } = require('path-to-regexp');

function Route(method, path, ...handlers) {
    this.method = method;
    this.path = path;
    this.handlers = handlers;
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

Route.prototype.handleRequest = async function (req, res) {
    for (const handler of this.handlers) {
        if (typeof handler !== 'function') {
            continue;
        }

        await handler(req, res);
    }
}

module.exports = Route;
