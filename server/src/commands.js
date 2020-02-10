const minimist = require('minimist');
const { gameState, reduce } = require('./game-state/game-state');

const commandResponse = 'command_response';

function executeCommand(rawCommand, clientSocket, worker) {
    const arguments = minimist(rawCommand.split(' '));
    const commandName = arguments._.splice(0, 1)[0] || 'help';
    switch (commandName) {
        case 'build': {
            const building = arguments._[0];
            const action = { action: 'build', building };
            const response = reduce(action);
            worker.postMessage(action);
            clientSocket.emit(commandResponse, response);
            break;
        }
        case 'resources': {
            clientSocket.emit(commandResponse, `Your current resources are:\n- Gold: ${gameState.resources.gold}`);
            break;
        }
        case 'help': {
            clientSocket.emit(
                commandResponse,
                'Available commands:\n' +
                '- help: Shows available commands\n' +
                '- build <building>: Creates a building\n' +
                '- resources: Views your current resources\n' +
                '- quit | exit | close: Closes the game'
            );
            break;
        }
        case 'quit':
        case 'exit':
        case 'close': {
            clientSocket.emit('disconnect-client');
            break;
        }
        default: {
            clientSocket.emit(commandResponse, `Invalid command: ${commandName}.\nUse 'help' to see all available commands.`);
        }
    }
}

module.exports = { executeCommand };