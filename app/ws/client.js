class Client {
    constructor(socket) {
        this.socket = socket;
        this.id = socket.id;
    }

    publish(event, data) {
        this.socket.emit(event, data);
    }

    subscribe(event, callback) {
        this.socket.on(event, callback);
    }
}

module.exports = Client;
