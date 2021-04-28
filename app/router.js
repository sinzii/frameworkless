const Route = require('./route');

const router = {};
router.routes = [];

function newRoute(method, path, handler) {
    router.routes.push(new Route(method, path, handler));
}

router.request = (method, path, handler) => {
    newRoute(method, path, handler);
};

const methods = ['get', 'post', 'put', 'delete'];
methods.forEach((method) => {
   router[method] = (path, handler) => {
       newRoute(method, path, handler);
   }
});

router.getMatchedRoute = (req) => {
    const { method, path } = req;

    for (const route of router.routes) {
        if (route.matched(method, path || '/')) {
            return route;
        }
    }

    return null;
}

module.exports = router;
