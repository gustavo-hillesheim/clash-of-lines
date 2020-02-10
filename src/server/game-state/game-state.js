const { createBuilding } = require('./building');

function newState() {
    return {
        buildings: {},
        resources: {
            gold: 0
        }
    };
};

const gameState = newState();

function reduce(action) {
    switch (action.action) {
        case 'setResources': {
            gameState.resources = action.resources;
            break;
        }
        case 'build': {
            const { building } = action;
            return createBuilding(building, gameState);
        }
        default: {
            return `Unknown action ${action.action}`;
        }
    }
}

module.exports = { gameState, reduce };