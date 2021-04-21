const router = require('../router');
const viewsEngine = require('../views_engine');

const viewHomePage = async (req, res) => {
    await viewsEngine.render(res, 'index', { welcome: 'Hello World' });
}

router.get('/', viewHomePage);

