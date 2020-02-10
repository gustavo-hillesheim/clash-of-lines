const minimist = require('minimist');
const { gameStates } = require('../game-state/game-state');
const { build } = require('./build');

const COMMAND_RESPONSE = 'command_response';

const commands = [];

function registerCommand(command) {
    commands.push(command);
}

function executeCommand(rawCommand, clientSocket, worker, player) {
    const arguments = minimist(rawCommand.split(' '));
    const commandName = arguments._.splice(0, 1)[0] || 'help';
    let foundCommand = false;
    commands
        .filter(command => command.name === commandName || (command.alias && command.alias.includes(commandName)))
        .forEach(command => {
            foundCommand = true;
            const response = command.action({ arguments, clientSocket, worker, player });
            if (response) {
                clientSocket.emit(COMMAND_RESPONSE, response);
            }
        });
    if (!foundCommand) {
        clientSocket.emit(COMMAND_RESPONSE, `Invalid command: ${commandName}.\nUse 'help' to see all available commands.`);
    }
}

function showHelp() {
    let help = 'Available commands:';
    commands.forEach(command => {
        let commandDescription = command.name;
        if (command.alias) {
            commandDescription += ' | ' + command.alias.join(' | ');
        }
        if (command.requiredParameters) {
            commandDescription += ' <' + command.requiredParameters.join('> <') + '>';
        }
        if (command.optionalParameters) {
            commandDescription += ' [' + command.optionalParameters.join('] [') + ']';
        }
        commandDescription += ' - ' + command.help;
        help += `\n- ${commandDescription}`;
    });
    return help;
}

function registerCommands() {
    registerCommand({
        name: 'build',
        optionalParameters: ['building'],
        help: 'Creates a building',
        action: build
    });
    registerCommand({
        name: 'resources',
        help: 'Views your current resources',
        action: ({ player }) => `Your current resources are:\n- Gold: ${gameStates[player].resources.gold}`
    });
    registerCommand({
        name: 'quit',
        alias: ['exit', 'close'],
        help: 'Closes the game',
        action: ({ clientSocket }) => {
            clientSocket.emit('disconnect_client');
            return false;
        }
    });
    registerCommand({
        name: 'help',
        help: 'Shows available commands',
        action: showHelp
    });
}

module.exports = { executeCommand, registerCommands };