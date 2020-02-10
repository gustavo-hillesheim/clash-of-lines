const commander = require('commander');
const commandParser = require('shell-quote');
const { gameState, reduce } = require('./game-state/game-state');

const commandResponse = 'command_response';

module.exports = (function () {
    let clientSocket = null;
    function executeCommand(command, socketClient) {
        command = command.replace(/\r?\n|\r/g, " ");
        const parsedCommand = commandParser.parse(command);
        clientSocket = socketClient;
        if (['-v', '--version', '-h', '--help'].includes(parsedCommand[0])) {
            clientSocket.emit(commandResponse, `Invalid command: ${parsedCommand[0]}.\nUse 'help' to see all available commands.`);
            return;
        }
        return commander.parse(process.argv.concat(parsedCommand));
    }

    function setupCommands(worker) {
        worker.on('message', reduce);

        commander.version('0.0.1');
        commander
            .command('help')
            .action(() => {
                if (clientSocket) {
                    commander.outputHelp(help => {
                        const commandsHelp = /Commands:\s((.|\s)*)/g.exec(help)[0];
                        clientSocket.emit(commandResponse, commandsHelp);
                        return '';
                    });
                }
            });
        commander
            .command('build <building>')
            .action(building => {
                const action = { action: 'build', building };
                const response = reduce(action);
                worker.postMessage(action);
                if (clientSocket) {
                    clientSocket.emit(commandResponse, response);
                }
            });
        commander
            .command('resources')
            .action(() => {
                if (clientSocket) {
                    clientSocket.emit(commandResponse,
                        `Your current resources are:\n- Gold: ${gameState.resources.gold}`
                    );
                }
            });
        commander
            .command('quit')
            .action(() => {
                if (clientSocket) {
                    clientSocket.emit('disconnect');
                }
            });
        commander.on('command:*', () => {
            if (clientSocket) {
                clientSocket.emit(commandResponse, `Invalid command: ${commander.args.join(' ')}.\nUse 'help' to see all available commands.`);
            }
        });
    }

    return { executeCommand, setupCommands };
})();