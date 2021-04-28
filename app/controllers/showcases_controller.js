const router = require('../router');
const viewEngine = require('../views_engine');

const viewShowcasesPage = async (req, res) => {
    await viewEngine.render(req, res, 'showcases');
}

router.get('/showcases', viewShowcasesPage);
