const BaseDao = require('./BaseDao');

class NoteDao extends BaseDao {
    get currentModel() {
        return this.models.NOTE;
    }
}

module.exports = new NoteDao();
