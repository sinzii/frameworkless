const BaseModel = require('../model');
const StringUtils = require('../utils/string');
const daoPool = require('../dao');

class BaseService extends BaseModel {
    getModelDao() {
        const daoName = StringUtils.capitalize(this.currentModel) + 'Dao';
        const modelDao = daoPool[daoName];
        if (!modelDao) {
            throw new BusinessError(`There is no DAO for model ${this.currentModel}`);
        }

        return modelDao;
    }

    async findById(id) {
        return this.getModelDao().findById(id);
    }

    async create(data) {

    }

    async update(data) {

    }

    async upsert(data) {

    }
}

module.exports = BaseService;
