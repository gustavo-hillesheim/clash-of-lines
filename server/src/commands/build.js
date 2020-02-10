const { reduce } = require('../game-state/game-state');

function build({ arguments, worker }) {
  const building = arguments._[0];
  const action = { action: 'build', building };
  const response = reduce(action);
  worker.postMessage(action);
  return response;
}

module.exports = { build };