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
}

module.exports = BaseModel;
module.exports.models = models;
