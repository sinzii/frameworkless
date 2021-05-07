const router = require('../router');
const AuthService = require('../services/AuthService');

/**
 * Handle request to login to the application
 *
 * @param req
 * @param res
 */
const doLogin = async (req, res) => {
    try {
        const {currentUser} = await AuthService.login(req.body);

        req.session.currentUser = currentUser;
    } catch (e) {
        if (e instanceof InvalidSubmissionDataError) {
            req.putFlashAttrs({
                message: e.message,
                messageStatus: 'danger',
                errors: e.errors,
                formInput: req.body
            });
        } else {
            throw e;
        }
    }

    res.sendRedirect('/');
}

router.post('/login', doLogin);

/**
 * Logout the user
 *
 * @param req
 * @param res
 */
const doLogout = async (req, res) => {
    req.session.destroy();

    res.sendRedirect('/');
}

router.get('/logout', doLogout);
