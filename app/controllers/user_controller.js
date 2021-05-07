const router = require('../router');
const UserService = require('../services/UserService');

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

router.post('/update-profile', doUpdateProfile);

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

router.post('/change-password', doChangePassword);

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

router.post('/suspend-account', doSuspendAccount);
