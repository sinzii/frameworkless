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

    async create(data) {
        const result = await this.currentCollection.insertOne(data);
        if (result.insertedCount === 0) {
            throw Error('There was a problem while trying to insert a new document');
        }

        return result.insertedId;
    }

    async update(data) {
        const { id } = data;
        if (!id) {
            throw new Error('An id should be presented to update a document');
        }

        delete data.id;
        const result = await this.currentCollection.updateOne({ _id: this.objectId(id) }, { $set: data }, { upsert: false });
        if (result.modifiedCount === 0) {
            throw new Error('Document\'s not found');
        }

        return id;
    }

    async upsert(data) {
        if (data.id) {
            await this.update(data);
            return data.id;
        }

        return this.create(data);
    }

    usingId(doc) {
        if (!doc) {
            return doc;
        }

        doc.id = doc._id;
        delete doc._id;

        return doc;
    }

    objectId(id) {
        if (id instanceof ObjectId) {
            return id;
        }

        return new ObjectId(id);
    }
}

module.exports = BaseDaoDieuLinh;
