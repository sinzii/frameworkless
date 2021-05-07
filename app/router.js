const Route = require('./route');

const router = {};
router.routes = [];

function newRoute(method, path, ...handlers) {
    router.routes.push(new Route(method, path, ...handlers));
}

router.request = (method, path, ...handlers) => {
    newRoute(method, path, ...handlers);
};

const methods = ['get', 'post', 'put', 'delete'];
methods.forEach((method) => {
   router[method] = (path, ...handlers) => {
       newRoute(method, path, ...handlers);
   }
});

router.getMatchedRoute = (req) => {
    const { method, path } = req;

    for (const route of router.routes) {
        const [matched, params] = route.matched(method, path || '/');

        if (matched) {
            req.params = params;
            return route;
        }
    }

    return null;
}

module.exports = router;
