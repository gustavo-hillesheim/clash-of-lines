const { Worker } = require('worker_threads');
const { reduce } = require('./game-state/game-state');
const { executeCommand } = require('./commands');
const { setupServerSocket } = require('./server-socket');

function startGameLoop() {
    return new Worker(`${__dirname}/game-loop.js`, { workerData: null });
}

const worker = startGameLoop();
worker.on('message', reduce);
const serverSocket = setupServerSocket(8912);

serverSocket.on('connection', socket => {
    socket.on('command', command => {
        executeCommand(command, socket, worker);
    });
});