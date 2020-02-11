const { Worker } = require('worker_threads');
const { reduce, createGameState } = require('./game-state/game-state');
const { executeCommand, registerCommands } = require('./commands/commands');
const { setupServerSocket } = require('./server-socket');

function startGameLoop() {
    return new Worker(`${__dirname}/game-loop.js`, { workerData: null });
}

const worker = startGameLoop();
worker.on('message', reduce);
registerCommands();
const serverSocket = setupServerSocket(8912);

serverSocket.on('connection', socket => {
    socket.on('set_name', (player, setupCompleted) => {
        const createGameStateAction = { action: 'createGameState', player };
        reduce(createGameStateAction);
        worker.postMessage(createGameStateAction);
        setupCompleted();
        socket.on('command', command => {
            executeCommand(command, socket, worker, player);
        });
    });
});