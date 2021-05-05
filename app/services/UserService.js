const BaseService = require('./base');
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

        const existedUser = await this.modelDao.findByEmail(data.email);
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
}

module.exports = new UserService();

