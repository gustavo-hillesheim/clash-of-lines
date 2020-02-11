const { reduce } = require('../game-state/game-state');
const { buildings } = require('../game-state/building');
const { capitalize } = require('../utils');

function build({ player, arguments, worker }) {
  const building = arguments._[0];
  if (arguments.list || arguments.l) {
    return listBuilding();
  }
  return createBuild(building, worker, player);
}

function createBuild(name, worker, player) {
  const action = { action: 'build', building: name.toLowerCase(), player };
  worker.postMessage(action);
  const reduceResponse = reduce(action);
  return reduceResponse ? `${capitalize(name)} was built! Current amount: ${reduceResponse.quantity}.` : `Unknown build: ${name}.`;
}

function listBuilding() {
  return 'Usage: build [building]\n' +
    'Available buildings:\n' +
    Array
      .from(buildings.entries())
      .map(entry => `${capitalize(entry[0])} - ${entry[1].description}`);
}

module.exports = { build };