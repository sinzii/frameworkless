const topics = {
    NUMBER_ONLINE_CLIENTS: 'NUMBER_ONLINE_CLIENTS',
    CHAT_ROOM_LIST: 'CHAT_ROOM_LIST'
}

class Topic {
    constructor(wsServer, name) {
        this.server = wsServer;
        this.name = `topic/${name}`;
        this.clientByConnectionId = new Map();
    }

    subscribe(client) {
        this.clientByConnectionId.set(client.id, client);
        client.socket.join(this.name);
    }

    unsubscribe(client) {
        this.clientByConnectionId.delete(client.id);
        client.socket.leave(this.name);
    }

    publish(data) {
        this.server.to(this.name).emit(this.name, data);
    }
}

module.exports = {
    Topic,
    topics
};
