const BaseService = require('./base');

class NoteService extends BaseService {
    get currentModel() {
        return this.models.NOTE;
    }


}

module.exports = new NoteService();
