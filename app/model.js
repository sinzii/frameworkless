const StringUtils = require('./utils/string');

const models = {
    USER: 'user',
    NOTE: 'note'
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
