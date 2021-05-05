const BaseModel = require('../model');
const daoPool = require('../dao');
const { validate } = require('../validator');

class BaseService extends BaseModel {
    get modelDao() {
        const daoName = `${this.currentModelCapitalized}Dao`;
        const modelDao = daoPool[daoName];
        if (!modelDao) {
            throw new BusinessError(`There is no DAO for model ${this.currentModelCapitalized}`);
        }

        return modelDao;
    }

    async findById(id) {
        return this.modelDao.findById(id);
    }

    async create(doc, creatorId) {
        doc.createdBy = creatorId;
        doc.createdAt = new Date();

        const validationSchemaName = `${this.currentModelCapitalized}Schema`;
        doc = await validate(validationSchemaName, doc, { omitFields: ['id'] });

        return this.modelDao.create(doc);
    }

    async update(doc, updaterId) {
        doc.updatedBy = updaterId;
        doc.updatedAt = new Date();

        console.log(doc);
        const validationSchemaName = `${this.currentModelCapitalized}Schema`;
        doc = await validate(validationSchemaName, doc);

        return this.modelDao.update(doc);
    }

    async upsert(doc, userId) {
        if (doc.id) {
            return this.update(doc, userId);
        }

        return this.create(doc, userId);
    }

    async find() {
        return this.modelDao.find();
    }
}

module.exports = BaseService;
