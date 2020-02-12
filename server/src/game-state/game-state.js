const { build } = require('./building');
const { isMainThread } = require('worker_threads');

function newState() {
    return {
        buildings: {},
        resources: {
            gold: 0
        }
    };
};

const gameStates = {};
let reduceWorker;
function setReduceWorker(worker) {
    reduceWorker = worker;
}

function reduce(action) {
    if (isMainThread && action.action !== 'setResources') {
        reduceWorker.postMessage(action);
    }
    const gameState = gameStates[action.player];
    switch (action.action) {
        case 'createGameState': {
            if (!gameState) {
                gameStates[action.player] = newState();
            }
            return true;
        }
        case 'setResources': {
            gameState.resources = action.resources;
            return true;
        }
        case 'build': {
            return build(action, gameState);
        }
        default: {
            throw `Unknown action ${action.action}`;
        }
    }
}

module.exports = { gameStates, reduce, setReduceWorker };