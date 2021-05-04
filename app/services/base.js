const BaseModel = require('../model');
const daoPool = require('../dao');
const { validate } = require('../validator');

class BaseService extends BaseModel {
    getModelDao() {
        const daoName = `${this.currentModelCapitalized}Dao`;
        const modelDao = daoPool[daoName];
        if (!modelDao) {
            throw new BusinessError(`There is no DAO for model ${this.currentModelCapitalized}`);
        }

        return modelDao;
    }

    async findById(id) {
        return this.getModelDao().findById(id);
    }

    async create(data, creatorId) {
        const validationSchemaName = `Create${this.currentModelCapitalized}Schema`;
        await validate(validationSchemaName, data);

        data.createdBy = creatorId;
        data.createdAt = new Date();

        return this.getModelDao().create(data);
    }

    async update(data, updaterId) {
        const validationSchemaName = `Update${this.currentModelCapitalized}Schema`;
        await validate(validationSchemaName, data);

        data.updatedBy = updaterId;
        data.updatedAt = new Date();

        return this.getModelDao().update(data);
    }

    async upsert(data, userId) {
        if (data.id) {
            return this.update(data, userId);
        }

        return this.create(data, userId);
    }

    async find() {
        return this.getModelDao().find();
    }
}

module.exports = BaseService;
