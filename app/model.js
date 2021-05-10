const StringUtils = require('./utils/string');

const models = {
    USER: 'User',
    NOTE: 'Note',
    TOKEN_BASED_DECISION: 'TokenBasedDecision',
}

class BaseModel {
    get models() {
        return models;
    }

    get currentModel() {
        throw new Error('Please override getter currentModel to provide model name');
    }

    get currentModelCapitalized() {
        return StringUtils.capitalize(this.currentModel);
    }
}

module.exports = BaseModel;
module.exports.models = models;
