const TokenService = require('./TokenService');
const BaseService = require('./BaseService');
const UserService = require('./UserService');
const TokenType = require('../utils/TokenType');

class TokenBasedDecisionService extends BaseService {
    get currentModel() {
        return this.models.TOKEN_BASED_DECISION;
    }

    /**
     * Issue a decision token. Only the user can issue the token of their own.
     *
     * @param type
     * @param userId token owner
     * @param maxAgeInMinutes
     * @param extraPayloadData
     * @return {Promise<string>}
     */
    async issueToken(type, userId, maxAgeInMinutes=60, extraPayloadData={}) {
        if (!TokenType.TokenTypeArr.includes(type)) {
            throw new BusinessError('Token type is invalid');
        }

        // find the target user first to fail fast if userId is not belong to any account
        const targetUser = await UserService.findById(userId);

        const payload = {
            type,
            sub: userId,
            ...extraPayloadData
        }

        const token = await TokenService.issueJwt(payload, maxAgeInMinutes);
        const tokenHash = await TokenService.hash(token, targetUser.salt);

        const newDecisionToken = {
            tokenHash,
            type,
            userId
        };

        await this.create(newDecisionToken);

        return token;
    }

    /**
     * Find a decision token by raw token and the owner
     *
     * @param token raw token
     * @param userId token owner
     * @return {Promise<*>}
     */
    async findOneByToken(token, userId) {
        const targetUser = await UserService.findById(userId);
        const tokenHash = await TokenService.hash(token, targetUser.salt);

        const decisionToken = await this.modelDao.findOne({tokenHash});

        if (!decisionToken) {
            throw new BusinessError('Token is not existed');
        }

        return decisionToken;
    }

    /**
     * Verify a token
     *
     * @param token
     * @return {Promise<*>}
     */
    async verifyToken(token) {
        const payload = await TokenService.verifyJwt(token);

        const decisionToken = await this.findOneByToken(token, payload.sub);

        if (!decisionToken.active) {
            throw new BusinessError('Token is invalid');
        }

        if (decisionToken.userId !== payload.sub) {
            throw new BusinessError('Token owner is not matched');
        }

        if (decisionToken.type !== payload.type) {
            throw new BusinessError('Token type is not matched');
        }

        return payload;
    }

    /**
     * Inactivate a token
     *
     * @param token raw token
     * @param userId who did this
     * @return {Promise<*>}
     */
    async inactivate(token, userId) {
        const payload = TokenService.decodeJwt(token);
        if (!payload) {
            throw new BusinessError('Token is invalid');
        }

        const decisionToken = await this.findOneByToken(token, payload.sub);
        decisionToken.active = false;

        return this.update(decisionToken, userId);
    }
}

module.exports = new TokenBasedDecisionService();
