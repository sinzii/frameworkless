const BaseDao = require('./BaseDao');

class UserDao extends BaseDao {
    get currentModel() {
        return this.models.USER;
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }
}

module.exports = new UserDao();
