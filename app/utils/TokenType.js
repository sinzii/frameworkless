const TokenType = {
    VERIFY_EMAIL: 'VERIFY_EMAIL',
    REMEMBER_ME: 'REMEMBER_ME',
    RESET_PASSWORD: 'RESET_PASSWORD'
}

const TokenTypeArr = Object.values(TokenType);

module.exports = TokenType;
module.exports.TokenTypeArr = TokenTypeArr;
