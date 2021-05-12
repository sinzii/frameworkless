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

    try {
        EmailService.checkEmailSendingLimitation(lastEmailSentAt);
    } catch (e) {
        if (e instanceof BusinessError) {
            req.putFlashAttrs({
                message: 'Please wait at least 1 minute to request sending verification email again',
                messageStatus: 'danger'
            });
        } else {
            throw e;
        }

        res.sendRedirect('/');
        return;
    }

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

    res.sendRedirect('/');
}

router.get('/verify-email', authenticated, verifyEmail);


/**
 * Send reset password email
 *
 * @param req
 * @param res
 */
const requestResetPassword = async (req, res) => {
    const {email} = req.body;
    const redirectUrl = '/?view=forget-password';

    if (!email) {
        req.putFlashAttrs({
            message: 'Invalid submission data',
            messageStatus: 'danger',
            errors: {
                email: 'Email address field is required'
            }
        });

        res.sendRedirect(redirectUrl);
        return;
    }

    try {
        EmailService.checkEmailSendingLimitation(req.session.lastEmailSentAt)
    } catch (e) {
        if (e instanceof BusinessError) {
            req.putFlashAttrs({
                message: 'Please wait at least 1 minute to request reset password again',
                messageStatus: 'danger'
            });
        } else {
            throw e;
        }

        res.sendRedirect(redirectUrl);
        return;
    }

    const targetUser = await UserService.findByEmail(email);
    if (targetUser) {
        const maxAgeInMinutes = 3;
        const token = await TokenBasedDecisionService.issueToken(
            TokenType.RESET_PASSWORD,
            targetUser.id,
            maxAgeInMinutes
        );

        EmailService.send({
            to: `${targetUser.name} <${targetUser.email}>`,
            subject: `Reset your password - Frameworkless`,
            html: await viewEngine.renderTemplate(req, 'emails/reset-password', {
                token,
                maxAgeInMinutes
            })
        }).then(rs => {
            logger.info('Send email successfully', rs);
        }).catch(err => {
            logger.error(`Fail to send email to ${targetUser.email}`, err);
        });

        req.session.lastEmailSentAt = new Date().getTime();
    }

    req.putFlashAttrs({
        message: 'A reset password email is sent, please check your mailbox',
        messageStatus: 'success'
    });

    res.sendRedirect(redirectUrl);
}

router.post('/forget-password', requestResetPassword);

/**
 * Reset password
 *
 * @param req
 * @param res
 */
const resetPassword = async (req, res) => {
    const {token} = req.body;

    if (!token) {
        throw new BusinessError('Invalid request');
    }

    const {type, sub} = await TokenBasedDecisionService.verifyToken(token);

    if (type !== TokenType.RESET_PASSWORD) {
        throw new BusinessError('Invalid request');
    }

    req.body.id = sub;

    try {
        await UserService.resetPassword(req.body, sub);
        await TokenBasedDecisionService.inactivate(token, sub);

        req.putFlashAttrs({
            message: 'The password has been reset successfully',
            messageStatus: 'success'
        });

        res.sendRedirect('/');
    } catch (e) {
        if (e instanceof InvalidSubmissionDataError) {
            req.putFlashAttrs({
                token,
                message: e.message,
                messageStatus: 'danger',
                errors: e.errors
            });

            res.sendRedirect('/?view=reset-password');
        } else {
            throw e;
        }
    }
}

router.post('/reset-password', resetPassword);
