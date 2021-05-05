const router = require('../router');
const UserService = require('../services/UserService');

/**
 * Get all users
 *
 * @param req
 * @param res
 */
const getUsers = async (req, res) => {
    const users = await UserService.find();

    res.sendJson(users);
}

router.get('/api/user', getUsers);

/**
 * Get user info by id
 *
 * @param req
 * @param res
 */
const getUser = async (req, res) => {
    const targetUser = await UserService.findById(req.params.id);
    UserService.removeSensitiveInformation(targetUser);

    res.sendJson(targetUser);
}

router.get('/api/user/:id', getUser);

/**
 * Register new user
 *
 * @param req
 * @param res
 */
const registerNewUser = async (req, res) => {
    const newUser = await UserService.registerNewUser(req.body);
    UserService.removeSensitiveInformation(newUser);

    res.sendJson(newUser);
}
router.post('/api/user', registerNewUser);
