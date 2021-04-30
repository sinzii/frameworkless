const BaseDao = require('./base');

class NoteDao extends BaseDao {
    get collectionName() {
        return 'note';
    }
}

module.exports = new NoteDao();
