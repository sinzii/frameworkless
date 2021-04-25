const {Server} = require('socket.io');
const logger = require('log4js').getLogger('ws');
const { Topic, topics } = require('./topic');
const NumberOnlineClientsTopic = require('./topics/NumberOnlineClientsTopic');
const Client = require('./client');
const { EventEmitter } = require('events');

const topicClasses = {
    NUMBER_ONLINE_CLIENTS: NumberOnlineClientsTopic,
}

Server.prototype.sub = function (ev, callback) {
    this.pubsub.on(ev, callback);
}

Server.prototype.pub = function (ev, ...args) {
    this.pubsub.emit(ev, args);
}

class WebSocket {
    constructor(httpServer) {
        this.server = new Server(httpServer);
        this.server.pubsub = new EventEmitter();
        this.clientByConnectionId = new Map();
        this.topicByName = new Map();
        Object.values(topics).forEach((topicName) => {
            const topicClass = topicClasses[topicName] || Topic;

            const topic = new topicClass(this.server, topicName)

            this.topicByName.set(topic.name, topic);
        });

        this.allowConnection();
    }

    allowConnection() {
        this.server.on('connection', async (socket) => {
            logger.debug('New connection, id:', socket.id);
            const client = this.addNewClient(socket);
            this.handleEvents(client);

            this.server.pub(NumberOnlineClientsTopic.ON_CHANGED);
        });
    }

    handleEvents(client) {
        this.handleDisconnect(client);
        this.handleSubscribeToTopic(client);
        this.handleUnsubscribeToTopic(client);
    }

    handleDisconnect(client) {
        client.subscribe("disconnect", (reason) => {
            logger.debug('A client is disconnected, reason', reason);

            client.socket.rooms.forEach((roomName) => {
                this.getTopic(roomName).unsubscribe(client);
            });

            this.server.pub(NumberOnlineClientsTopic.ON_CHANGED);
        });
    }

    handleSubscribeToTopic(client) {
        client.subscribe('subscribe', async (topicName) => {
            logger.debug(`Client ${client.id} tries to subscribe to topic`, topicName);
            const topic = this.getTopic(topicName);
            if (!topic) {
                client.publish('subscribe', `Topic ${topicName} is not existed!`);
                logger.error(`Topic ${topicName} is not existed for client`, client.id);
                return;
            }

            topic.subscribe(client);
            client.publish('subscribe', `Topic ${topicName} has been successfully subscribed!`);

            if (topic instanceof NumberOnlineClientsTopic) {
                client.publish(topic.name, await topic.getCurrentOnlineClients());
            }

            logger.debug(`Client ${client.id} has been successfully subscribed to topic`, topicName);
        });
    }

    handleUnsubscribeToTopic(client) {
        client.subscribe('unsubscribe', (topicName) => {
            logger.debug(`Client ${client.id} tries to unsubscribe to topic`, topicName);
            const topic = this.getTopic(topicName);
            if (!topic) {
                client.publish('unsubscribe', `Topic ${topicName} is not existed!`);
                logger.error(`Topic ${topicName} is not existed for client`, client.id);
                return;
            }

            topic.unsubscribe(client);
            client.publish('unsubscribe', `Topic ${topicName} has been successfully unsubscribed!`);
            logger.debug(`Client ${client.id} has been successfully unsubscribed to topic`, topicName);
        });
    }

    getClient(clientId) {
        return this.clientByConnectionId.get(clientId);
    }

    addNewClient(socket) {
        const client = new Client(socket);
        this.clientByConnectionId.set(client.id, client);

        return client;
    }

    getTopic(name) {
        return this.topicByName.get(`topic/${name}`);
    }

    hasTopic(name) {
        return !!this.getTopic(name);
    }

    publish(event, data) {
        this.server.emit(event, data);
    }
}

module.exports = WebSocket;
