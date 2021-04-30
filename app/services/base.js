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

    async create(data) {
        const validationSchemaName = `Create${this.currentModelCapitalized}Schema`;
        await validate(validationSchemaName, data);
        return this.getModelDao().create(data);
    }

    async update(data) {
        const validationSchemaName = `Update${this.currentModelCapitalized}Schema`;
        await validate(validationSchemaName, data);
        return this.getModelDao().update(data);
    }

    async upsert(data) {
        if (data.id) {
            return this.update(data);
        }

        return this.create(data);
    }

    async find() {
        return this.getModelDao().find();
    }
}

module.exports = BaseService;
