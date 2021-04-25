const router = require('../router');
const viewsEngine = require('../views_engine');

const viewHomePage = async (req, res) => {
    await viewsEngine.render(res, 'index');
}

const viewAboutPage = async (req, res) => {
    await viewsEngine.render(res, 'about');
}

router.get('/', viewHomePage);
router.get('/about', viewAboutPage);

