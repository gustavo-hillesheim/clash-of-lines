class Mine {

    static description = 'Increases gold production by 1.';
    quantity = 1;
    goldProduced = 1;
    xpPoints = 1;

    update(gameState) {
        gameState.resources.gold += this.quantity * this.goldProduced;
    }
}
const buildings = new Map();
buildings.set('mine', Mine);

function build(action, gameState) {
    const { building } = action;
    if (!buildings.has(building)) {
        return false;
    }
    const buildInGame = !!gameState.buildings[building];
    if (buildInGame) {
        buildInGame.quantity++;
        return { quantity: buildInGame.quantity };
    } else {
        const buildingClass = buildings.get(building);
        gameState.buildings[building] = new buildingClass();
        return { quantity: 1 };
    }
}

module.exports = { build, buildings };