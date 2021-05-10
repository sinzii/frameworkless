const router = require('../router');
const UserService = require('../services/UserService');
const EmailService = require('../services/EmailService');
const {authenticated} = require('../middlewares/permissions');
const logger = require('log4js').getLogger('app/controller/user_controller');
const viewEngine = require('../views_engine');
const TokenBasedDecisionService = require('../services/TokenBasedDecisionService');
const TokenType = require('../utils/TokenType');

/**
 * Update user profile
 *
 * @param req
 * @param res
 */
const doUpdateProfile = async (req, res) => {
    const currentUserId = req.session.currentUser.id;
    req.body.id = currentUserId;

    try {
        await UserService.updateProfile(req.body, currentUserId);

        req.session.currentUser = await UserService.findById(currentUserId);

        req.putFlashAttrs({
            message: 'Profile has been updated successfully',
            messageStatus: 'success'
        });

        res.sendRedirect('/');
    } catch (e) {
        if (e instanceof InvalidSubmissionDataError) {
            req.putFlashAttrs({
                message: e.message,
                messageStatus: 'danger',
                errors: e.errors,
                formInput: req.body
            });

            res.sendRedirect('/?view=update-profile');
        } else {
            throw e;
        }
    }
}

router.post('/update-profile', authenticated, doUpdateProfile);

/**
 * Change password for current user
 *
 * @param req
 * @param res
 */
const doChangePassword = async (req, res) => {
    const currentUserId = req.session.currentUser.id;
    req.body.id = currentUserId;

    try {
        await UserService.changePassword(req.body, currentUserId);

        // require user to login again after changing password
        delete req.session.currentUser;

        req.putFlashAttrs({
            message: 'New password has been set successfully, please login again',
            messageStatus: 'success'
        });

        res.sendRedirect('/');
    } catch (e) {
        if (e instanceof InvalidSubmissionDataError) {
            req.putFlashAttrs({
                message: e.message,
                messageStatus: 'danger',
                errors: e.errors
            });

            res.sendRedirect('/?view=change-password');
        } else {
            throw e;
        }
    }
}

router.post('/change-password', authenticated, doChangePassword);

/**
 * Suspend the account
 *
 * @param req
 * @param res
 */
const doSuspendAccount = async (req, res) => {
    const currentUserId = req.session.currentUser.id;
    req.body.id = currentUserId;

    try {
        await UserService.suspendAccount(req.body, currentUserId);

        // logout the user
        delete req.session.currentUser;

        req.putFlashAttrs({
            message: 'Your account has been suspended successfully',
            messageStatus: 'success'
        });

        res.sendRedirect('/');
    } catch (e) {
        if (e instanceof InvalidSubmissionDataError) {
            req.putFlashAttrs({
                message: e.message,
                messageStatus: 'danger',
                errors: e.errors
            });

            res.sendRedirect('/?view=suspend-account');
        } else {
            throw e;
        }
    }
}

router.post('/suspend-account', authenticated, doSuspendAccount);

/**
 * Send a verify email to the mailbox of current user
 *
 * @param req
 * @param res
 */
const verifyEmail = async (req, res) => {
    const {currentUser, lastEmailSentAt} = req.session;

    const canSend = () => {
        if (!lastEmailSentAt || typeof lastEmailSentAt !== 'number') {
            return true;
        }

        const ONE_MIN_IN_MILLISECONDS = 60 * 1000;
        return new Date().getTime() - lastEmailSentAt > ONE_MIN_IN_MILLISECONDS;
    };

    if (!canSend()) {
        req.putFlashAttrs({
            message: 'Please wait at least 1 minutes to request sending verification email again',
            messageStatus: 'danger'
        });
    } else {
        const maxAgeInMinutes = 3;
        const token = await TokenBasedDecisionService.issueToken(
            TokenType.VERIFY_EMAIL,
            currentUser.id,
            maxAgeInMinutes
        );

        EmailService.send({
            to: `${currentUser.name} <${currentUser.email}>`,
            subject: 'Verify your email - Frameworkless',
            html: await viewEngine.renderTemplate(req, 'emails/verification-email', {
                token,
                maxAgeInMinutes
            })
        }).then(rs => {
            logger.info('Sending email successful', rs);
        }, err => {
            logger.error(`Fail to send email to ${currentUser.email}`, err);
        });

        req.session.lastEmailSentAt = new Date().getTime();

        req.putFlashAttrs({
            message: 'The verification email has been sent, please check your mailbox',
            messageStatus: 'success'
        });
    }

    res.sendRedirect('/');
}

router.get('/verify-email', authenticated, verifyEmail);
