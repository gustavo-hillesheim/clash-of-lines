class Mine {

    quantity = 1;
    goldProduced = 1;

    update(gameState) {
        gameState.resources.gold += this.quantity * this.goldProduced;
    }
}

const buildings = {
    mine: {
        class: Mine,
        description: 'A mine'
    }
}

function createBuilding(building, gameState) {
    if (gameState.buildings[building]) {
        gameState.buildings[building].quantity++;
        return `Successfully built ${building}! Current quantity: ${gameState.buildings[building].quantity}.`;
    } else if (buildings[building]) {
        gameState.buildings[building] = new buildings[building].class();
        return `Successfully built ${building}! Current quantity: ${gameState.buildings[building].quantity}.`;
    }
    return `Unknown build: ${building}.`;
}

module.exports = { createBuilding };