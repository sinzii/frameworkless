const { getDbClient } = require('../../setup/db');
const BaseModel = require('../../model');
const { ObjectId } = require('mongodb');

class BaseDaoDieuLinh extends BaseModel { // don't get confused, that's my crush's name =))), originally BaseDao
    get dbClient() {
        return getDbClient();
    }

    get db() {
        return this.dbClient.currentDb;
    }

    get currentCollection() {
        return this.db.collection(this.currentModel);
    }

    async findOne(query, options) {
        const doc = await this.currentCollection.findOne(query, options);
        return this.usingId(doc);
    }

    async findById(id) {
        return this.findOne({ _id: this.objectId(id) });
    }

    async find(query, options) {
        const cursor = this.currentCollection.find(query, options);
        const docs = await cursor.toArray();
        return docs.map(this.usingId);
    }

    /**
     * Create a new record of current model
     * We don't do data validation & verification here so you should use model service for that purpose
     *
     * @param doc
     * @returns {Promise<ObjectId>}
     */
    async create(doc) {
        // Record id will be automatically generated by mongodb so we should not directly pass this in
        delete doc.id;

        const result = await this.currentCollection.insertOne(doc);
        if (result.insertedCount === 0) {
            throw new BusinessError('There was a problem while trying to insert a new record');
        }

        return result.insertedId;
    }

    /**
     * Perform updating for an existing record
     *
     *
     * @param doc
     * @returns {Promise<*>}
     */
    async update(doc) {
        const { id } = doc;
        if (!id) {
            throw new BusinessError('An id should be presented to update a record');
        }

        const existedOne = await this.findById(id);
        if (!existedOne) {
            throw new ResourceNotFoundError();
        }

        const changedData = this.getChangedData(doc, existedOne);

        if (!changedData) {
            return id;
        }

        await this.beforeUpdate(doc, changedData);

        await this.currentCollection.updateOne(
            { _id: this.objectId(id) },
            { $set: changedData },
            { upsert: false }
        );

        return id;
    }

    /**
     * A hook running before updating a record
     *
     * @param doc
     * @param changedData
     * @return {Promise<void>}
     */
    async beforeUpdate(doc, changedData) {
        // do nothing here!
    }

    async upsert(doc) {
        if (doc.id) {
            await this.update(doc);
            return doc.id;
        }

        return this.create(doc);
    }

    usingId(doc) {
        if (!doc) {
            return doc;
        }

        doc.id = doc._id.toString();
        delete doc._id;

        return doc;
    }

    objectId(id) {
        if (id instanceof ObjectId) {
            return id;
        }

        if (!ObjectId.isValid(id)) {
            throw new ResourceNotFoundError();
        }

        return new ObjectId(id);
    }

    /**
     * We expect newData and currentData object pass into this function only contain valid fields of current model
     *
     * @param newData
     * @param currentData
     * @returns {{}|null}
     */
    getChangedData(newData, currentData) {
        const changedData = {};

        Object.keys(newData).forEach((field) => {
            if (currentData[field] === undefined || currentData[field] !== newData[field]) {
                changedData[field] = newData[field];
            }
        });

        if (Object.keys(changedData).length === 0) {
            return null;
        }

        return changedData;
    }
}

module.exports = BaseDaoDieuLinh;
