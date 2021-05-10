const BaseDao = require('./BaseDao');

class UserDao extends BaseDao {
    get currentModel() {
        return this.models.USER;
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }

    async beforeUpdate(doc, changedData) {
        // if email is changed, then user should verify the email again
        if (changedData.email) {
            changedData.verified = false;
        }
    }
}

module.exports = new UserDao();
