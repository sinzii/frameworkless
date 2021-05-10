const BaseDao = require('./BaseDao');

class TokenBasedDecisionDao extends BaseDao {
    get currentModel() {
        return this.models.TOKEN_BASED_DECISION;
    }
}

module.exports = new TokenBasedDecisionDao();
