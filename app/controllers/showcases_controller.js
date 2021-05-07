const router = require('../router');
const viewEngine = require('../views_engine');
const {authenticated} = require('../middlewares/permissions');

const viewShowcasesPage = async (req, res) => {
    await viewEngine.render(req, res, 'showcases');
}

router.get('/showcases', authenticated, viewShowcasesPage);
