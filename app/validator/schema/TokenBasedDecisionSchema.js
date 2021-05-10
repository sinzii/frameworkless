const BaseSchema = require('./BaseSchema');
const {TokenTypeArr} = require('../../utils/TokenType');
const yup = require('yup');

const TokenBasedDecisionSchema = yup.object().shape(Object.assign({
    tokenHash: yup.string().required(),
    active: yup.boolean().default(true),
    type: yup.mixed().oneOf(TokenTypeArr).required(),
    userId: yup.string().required()
}, BaseSchema));

module.exports = {
    TokenBasedDecisionSchema
}
