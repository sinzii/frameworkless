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
