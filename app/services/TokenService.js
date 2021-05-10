const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../config');


class TokenService {
    get signingSecret() {
        return config['SECURITY_SIGNING_SECRET'];
    }

    /**
     * Issue a json web token with the provided payload
     *
     * @param payload
     * @param maxAgeInMinutes
     * @return {Promise<string>} of token
     */
    async issueJwt(payload, maxAgeInMinutes=60) {
        return new Promise((resolve, reject) => {
            const options = {
                issuer: 'FWL',
                expiresIn: maxAgeInMinutes * 60 // in seconds
            };

            const callback = (err, token) => {
                if (err) {
                    reject(new BusinessError(err.message));
                } else {
                    resolve(token);
                }
            };

            jwt.sign(payload, this.signingSecret, options, callback);
        });
    }

    /**
     * Verify a jwt
     *
     * @param token
     * @return {Promise<*>} of payload
     */
    async verifyJwt(token) {
        return new Promise((resolve, reject) => {
            const options = {
                issuer: 'FWL'
            };

            const callback = (err, payload) => {
                if (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        reject(new BusinessError('Token is expired'));
                    } else {
                        reject(new BusinessError('Token is invalid'));
                    }
                } else {
                    resolve(payload);
                }
            };

            jwt.verify(token, this.signingSecret, options, callback);
        });
    }

    /**
     * Decode a jwt
     *
     * @param token
     * @param complete
     * @return {Promise<null|{payload, signature, header: (header|string|{isValid: *, message: string})}>}
     */
    async decodeJwt(token, complete=false) {
        return jwt.decode(token, {complete});
    }

    /**
     * Generate a salt for hashing content
     * @param length
     * @return {string}
     */
    generateSalt(length=16) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Hashing a raw content using provided salt and algorithm
     *
     * @param rawContent
     * @param salt
     * @param algorithm
     * @return {Promise<string>}
     */
    async hash(rawContent, salt, algorithm='sha512') {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(
                rawContent, salt, 10000, 100, algorithm,
                function (err, derivedKey) {
                    if (err) {
                        reject(new BusinessError('There an error occurred while hashing'));
                    } else {
                        resolve(derivedKey.toString('hex'));
                    }
                }
            );
        });
    }
}

module.exports = new TokenService();
