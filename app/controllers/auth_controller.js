const config = require('../config');
const router = require('../router');
const AuthService = require('../services/AuthService');
const TokenBasedDecisionService = require('../services/TokenBasedDecisionService');
const UserService = require('../services/UserService');
const {authenticated} = require('../middlewares/permissions');
const TokenType = require('../utils/TokenType');

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
 * Trigger token decision functionality based on its type
 *
 * @param req
 * @param res
 * @return {Promise<void>}
 */
const triggerTokenDecision = async (req, res) => {
    const {token} = req.query;

    if (!token) {
        throw new ResourceNotFoundError();
    }

    const {type, sub} = await TokenBasedDecisionService.verifyToken(token);
    switch (type) {
        case TokenType.VERIFY_EMAIL:
            await UserService.verifyEmail(sub);
            await TokenBasedDecisionService.inactivate(token, sub)

            // reload current user if the user's logged in
            const currentUser = req?.session?.currentUser;
            if (currentUser?.id === sub) {
                req.session.currentUser = await UserService.findById(currentUser?.id);
            }

            req.putFlashAttrs({
                message: 'Your email has been verified',
                messageStatus: 'success'
            });

            res.sendRedirect('/');
            break;
        case TokenType.RESET_PASSWORD:
            req.putFlashAttrs({
                token
            });

            res.sendRedirect('/?view=reset-password');
            break;
        default:
            throw new ResourceNotFoundError();
    }
}

router.get('/trigger-decision', triggerTokenDecision);

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

router.get('/logout', authenticated, doLogout);
