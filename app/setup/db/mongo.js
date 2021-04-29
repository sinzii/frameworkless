const config = require('../../config');
const { MongoClient } = require('mongodb');
const logger = require('log4js').getLogger('setup/db/mongo');

const connect = async () => {
    const mongoUrl = config['DB_URL'];

    const mongoClient = new MongoClient(mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });

    try {
        await mongoClient.connect();

        return mongoClient;
    } catch (e) {
        logger.error("Cannot connect to mongo db, please check again the mongo server connection");
        throw e;
    }
}

module.exports = connect;
