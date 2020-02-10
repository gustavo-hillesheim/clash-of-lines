const io = require('socket.io-client');
const readline = require('readline');

async function ask(question) {
    return new Promise(resolve => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        rl.question(`${question} `, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

async function readNextCommand(socket) {
    const answer = await ask('>');
    socket.emit('command', answer);
}

function configSocket(socket) {
    socket.on('command_response', response => {
        console.log(response);
        readNextCommand(socket);
    });
    socket.on('disconnect_client', () => {
        socket.disconnect();
        process.exit();
    });
    readNextCommand(socket);
}

async function init() {
    const server = await ask('Server host:');
    const player = await ask('Nickname:');
    const socket = io(server);
    socket.emit('set_name', player, () => configSocket(socket));
}

init();