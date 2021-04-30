const BaseDao = require('./base');

class UserDao extends BaseDao {
    get collectionName() {
        return 'user';
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }
}

module.exports = new UserDao();
