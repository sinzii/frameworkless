const BaseService = require('./BaseService');
const UserService = require('./UserService');
const validator = require('../validator');

class AuthService extends BaseService {
    /**
     * Login user
     *
     * @param data submitted by login form and must follow LoginSchema
     */
    async login(data) {
        data = await validator.validate('LoginSchema', data);

        const {email, password} = data;

        const targetUser = await UserService.findByEmail(email);
        if (!targetUser) {
            throw new InvalidSubmissionDataError('Email or password is not correct');
        }

        const {passwordHash} = await UserService.hashingPassword(password, targetUser.salt);
        if (targetUser.passwordHash !== passwordHash) {
            throw new InvalidSubmissionDataError('Email or password is not correct');
        }

        if (targetUser.suspended) {
            throw new InvalidSubmissionDataError('The account has been suspended');
        }

        return {
            currentUser: targetUser
        };
    }
}

module.exports = new AuthService();
