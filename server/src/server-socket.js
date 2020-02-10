function setupServerSocket(port) {
    const app = require('express')();
    const http = require('http').createServer(app);
    const socket = require('socket.io')(http);
    http.listen(port);
    return socket;
}

module.exports = { setupServerSocket };