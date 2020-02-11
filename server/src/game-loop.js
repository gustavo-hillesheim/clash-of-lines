const { parentPort: mainThread } = require('worker_threads');
const { gameStates, reduce } = require('./game-state/game-state');

mainThread.on('message', reduce);
mainThread.on('error', process.exit.bind(process));
mainThread.on('exit', process.exit.bind(process));

setInterval(() => {
    Object.keys(gameStates)
        .forEach(player => {
            const gameState = gameStates[player];
            Object.values(gameState.buildings)
                .forEach(building => building.update(gameState));
            mainThread.postMessage({
                player,
                action: 'setResources',
                resources: { gold: gameState.resources.gold }
            });
        });
}, 1000);