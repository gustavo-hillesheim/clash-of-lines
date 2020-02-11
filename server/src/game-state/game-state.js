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

function reduce(action) {
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

module.exports = { gameStates, reduce };