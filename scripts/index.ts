import * as $ from "jquery";
import io from "socket.io-client";

const updateUserCounter = function (number) {
    $('span.online-users-counter').text(number);
}

const bootstrapClientSocket = () => {
    const socket = io();

    socket.on('subscribe', (success, msg) => {
        if (success) {
            socket.on('topic/NUMBER_ONLINE_CLIENTS', (msg) => {
                updateUserCounter(msg);
            });
        }
    }).emit('subscribe', 'NUMBER_ONLINE_CLIENTS');
}

$(document).ready(function () {
    bootstrapClientSocket();
});
