const { getDbClient } = require('../../setup/db');

class BaseDaoDieuLinh { // don't get confused, that's my crush's name =))), originally BaseDao
    get dbClient() {
        return getDbClient();
    }

    get db() {
        return this.dbClient.currentDb;
    }

    get collectionName() {
        throw new Error('Please override getter collectionName to provide collection name for current DAO');
    }

    get currentCollection() {
        return this.db.collection(this.collectionName);
    }

    async findOne(query, options) {
        const doc = await this.currentCollection.findOne(query, options);
        return this.usingId(doc);
    }

    async findById(id) {
        const query = {
            _id: id
        };

        return this.findOne(query);
    }

    async find(query, options) {
        const cursor = this.currentCollection.find(query, options);
        const docs = await cursor.toArray();
        return docs.map(this.usingId);

    }

    async create(data) {
        const result = this.currentCollection.insertOne(data);
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
        const result = this.currentCollection.updateOne({ _id: id }, { $set: data }, { upsert: false });
        if (result.modifiedCount === 0) {
            throw new Error('Document\'s not found');
        }
    }

    async upsert(data) {
        if (data.id) {
            await this.update(data);
            return data.id;
        }

        return this.create(data);
    }

    usingId(doc) {
        doc.id = doc._id;
        delete doc._id;

        return doc;
    }
}

module.exports = BaseDaoDieuLinh;
