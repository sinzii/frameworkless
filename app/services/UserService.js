const BaseService = require('./BaseService');
const validator = require('../validator');
const crypto = require('crypto');

class UserService extends BaseService {
    get currentModel() {
        return this.models.USER;
    }

    /**
     * Register a new user
     *
     * @param data register data follows RegisterUserSchema (ref: app/validator/schema/UserSchema.js)
     * @param userId of who performs the action, leave this param a falsy value if this is a self-register user
     */
    async registerNewUser(data, userId) {
        data = await validator.validate('RegisterUserSchema', data);

        if (data.password !== data.confirmPassword) {
            throw new InvalidSubmissionDataError(undefined, {
                confirmPassword: 'Confirm password must match password'
            });
        }

        const existedUser = await this._isEmailReadyToUse(data.email);
        if (existedUser) {
            throw new InvalidSubmissionDataError(undefined, {
                email: 'This is email has already been registered for another account'
            })
        }

        Object.assign(data, await this.hashingPassword(data.password));

        delete data.password;
        delete data.confirmPassword;

        const newUserId = await this.create(data, userId);

        return await this.findById(newUserId);
    }

    async _hash(rawPassword, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(
                rawPassword, salt, 10000, 100, 'sha512',
                function (err, derivedKey) {
                    if (err) {
                        reject(new BusinessError('There an error occurred while processing the password'));
                    } else {
                        resolve(derivedKey.toString('hex'));
                    }
                }
            );
        });
    }

    async hashingPassword(rawPassword, salt) {
        if (!salt) {
            salt = crypto.randomBytes(16).toString('hex');
        }

        const passwordHash = await this._hash(rawPassword, salt);

        return {
            passwordHash,
            salt,
        };
    }

    removeSensitiveInformation(docs) {
        if (!Array.isArray(docs)) {
            docs = [docs];
        }

        docs.forEach((doc) => {
            delete doc.passwordHash;
            delete doc.salt;
        });

        return docs;
    }

    async findByEmail(email) {
        return await this.modelDao.findByEmail(email);
    }

    /**
     * Check if an email is ready to use (create or update an user)
     *
     * @param email
     * @param updatedUserId if it's to update a user profile
     * @return {Promise<boolean>}
     * @private
     */
    async _isEmailReadyToUse(email, updatedUserId) {
        const existedUsers = await this.find({email});
        const numberOfExistedUserUsingTheEmail = existedUsers.length;

        const performUpdateProfile = !!updatedUserId;

        if (!performUpdateProfile) { // for creating new user
            return numberOfExistedUserUsingTheEmail === 0;
        }

        if (numberOfExistedUserUsingTheEmail === 0) {
            return true;
        } else if (numberOfExistedUserUsingTheEmail === 1) {
            const updateTheExistedUserWithTheSameEmail = existedUsers[0].id === updatedUserId;

            return updateTheExistedUserWithTheSameEmail;
        } else if (numberOfExistedUserUsingTheEmail > 1) {
            return false;
        }
    }

    /**
     * Update user profile
     *
     * @param data submitted data which follow UpdateUserProfileSchema
     * @param userId
     * @return Updated User Id
     */
    async updateProfile(data, userId) {
        data = await validator.validate('UpdateUserProfileSchema', data);

        const canUpdateEmail = await this._isEmailReadyToUse(data.email, data.id);
        if (!canUpdateEmail) {
            throw new InvalidSubmissionDataError(undefined, {
                email: 'This is email has already been registered for another account'
            })
        }

        return this.update(data, userId);
    }

    /**
     * Verify if a rawPassword is correct for an user
     *
     * @param user
     * @param rawPassword
     * @return {Promise<boolean>}
     */
    async verifyPassword(user, rawPassword) {
        const passwordHash = await this._hash(rawPassword, user.salt);
        return passwordHash === user.passwordHash;
    }

    /**
     * Change password for a user
     *
     * @param data submitted data following ChangePasswordSchema
     * @param userId
     * @return Updated User Id
     */
    async changePassword(data, userId) {
        data = await validator.validate('ChangePasswordSchema', data);

        // compare newPassword & confirmPassword
        if (data.newPassword !== data.confirmPassword) {
            throw new InvalidSubmissionDataError(undefined, {
                confirmPassword: 'Confirm password must match new password'
            });
        }

        const targetUser = await this.findById(data.id);
        if (!targetUser) {
            throw new InvalidSubmissionDataError('User is not found');
        }

        // check if password is correct
        if (!await this.verifyPassword(targetUser, data.password)) {
            throw new InvalidSubmissionDataError(undefined, {
                password: 'Password is not correct'
            });
        }

        // check if new password is different from old password
        const newPasswordHash = await this._hash(data.newPassword, targetUser.salt);
        if (newPasswordHash === targetUser.passwordHash) {
            throw new InvalidSubmissionDataError(undefined, {
                newPassword: 'You should use a new password'
            });
        }

        // change the password
        targetUser.passwordHash = newPasswordHash;

        // update new password
        return this.update(targetUser, userId);
    }

    async suspendAccount(data, userId) {
        data = await validator.validate('SuspendAccountSchema', data);

        const targetUser = await this.findById(data.id);
        if (!targetUser) {
            throw new InvalidSubmissionDataError('User is not found');
        }

        const isCorrectPassword = await this.verifyPassword(targetUser, data.password);
        if (!isCorrectPassword) {
            throw new InvalidSubmissionDataError(undefined, {
                password: 'Password is not correct'
            });
        }

        if (targetUser.suspended) {
            return targetUser.id;
        }

        targetUser.suspended = true;

        return this.update(targetUser, userId);
    }
}

module.exports = new UserService();

