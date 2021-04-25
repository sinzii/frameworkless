const { Topic, topics } = require('../topic');

class NumberOnlineClientsTopic extends Topic {
    static ON_CHANGED = 'NUMBER_OF_ONLINE_CLIENTS_CHANGED';
    constructor(wsServer) {
        super(wsServer, topics.NUMBER_ONLINE_CLIENTS);

        this.server.sub(NumberOnlineClientsTopic.ON_CHANGED, this.onChangeNumberOnlineClients)
    }

    getCurrentOnlineClients = async () => {
        const allSockets = await this.server.allSockets();
        return allSockets.size;
    }

    onChangeNumberOnlineClients = async () => {
        this.publish(await this.getCurrentOnlineClients());
    }
}

module.exports = NumberOnlineClientsTopic;
