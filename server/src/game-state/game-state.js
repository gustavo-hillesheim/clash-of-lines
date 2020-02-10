const { build } = require('./building');

function newState() {
    return {
        buildings: {},
        resources: {
            gold: 0
        }
    };
};

const gameStates = {};

function createGameState(player) {
    if (!gameStates[player]) {
        gameStates[player] = newState();
    }
}

function reduce(action) {
    const gameState = gameStates[action.player];
    console.log(gameStates, action.player, gameState);
    switch (action.action) {
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

module.exports = { gameStates, reduce, createGameState };