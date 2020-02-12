const { reduce } = require('../game-state/game-state');
const { buildings } = require('../game-state/building');
const { capitalize } = require('../utils');

function build({ player, arguments }) {
  const building = arguments._[0];
  if (arguments.list || arguments.l || !building) {
    return listBuilding();
  }
  return createBuild(building, player);
}

function createBuild(name, player) {
  const action = { action: 'build', building: name.toLowerCase(), player };
  const reduceResponse = reduce(action);
  return reduceResponse ? `${capitalize(name)} was built! Current quantity: ${reduceResponse.quantity}.` : `Unknown build: ${name}.`;
}

function listBuilding() {
  return 'Usage: build [building]\n' +
    'Available buildings:\n' +
    Array
      .from(buildings.entries())
      .map(entry => `${capitalize(entry[0])} - ${entry[1].description}`);
}

module.exports = { build };