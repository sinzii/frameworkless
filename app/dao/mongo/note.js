const BaseDao = require('./base');

class NoteDao extends BaseDao {
    get currentModel() {
        return this.models.NOTE;
    }
}

module.exports = new NoteDao();
