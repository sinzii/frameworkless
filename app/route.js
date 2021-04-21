function Route(method, path, handler) {
    this.method = method;
    this.path = path;
    this.handler = handler;
}

Route.prototype.matched =  function (method, path) {
    return this.method.toLowerCase() === method.toLowerCase()
        && this.path === path;
}

module.exports = Route;
