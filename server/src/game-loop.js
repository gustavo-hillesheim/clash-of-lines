const { parentPort: mainThread } = require('worker_threads');
const { gameState, reduce } = require('./game-state/game-state');

mainThread.on('message', reduce);
mainThread.on('error', process.exit.bind(process));
mainThread.on('exit', process.exit.bind(process));

setInterval(() => {
    Object.values(gameState.buildings)
        .forEach(building => {
            building.update(gameState);
        });
    mainThread.postMessage({ action: 'setResources', resources: { gold: gameState.resources.gold } });
}, 1000);