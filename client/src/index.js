const io = require('socket.io-client');
const readLine = require('readline');

function readNextCommand(socket) {
    const rl = readLine.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('> ', answer => {
        socket.emit('command', answer);
        rl.close();
    });
}

function setupSocket(host) {
    return io(host);
}

const socket = setupSocket('http://localhost:8912');
socket.on('command_response', response => {
    console.log(response);
    readNextCommand(socket);
});
socket.on('disconnect-client', () => {
    socket.disconnect();
    process.exit();
});
readNextCommand(socket);