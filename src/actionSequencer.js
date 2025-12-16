const chalk = require('chalk');
const { terminal } = require('./terminal.js');

async function executeSequence(actionIds, flatMap) {
    console.log(chalk.blue(`Executing sequence: ${actionIds.join(', ')}`));

    for (const id of actionIds) {
        const action = flatMap[id];
        if (!action) {
            console.error(chalk.red(`Error: Action with id '${id}' not found.`));
            continue;
        }

        if (action.type === 'action' && action.command) {
            console.log(chalk.blue(`Executing command: [id: ${action.id} name: ${action.name} ]`));
            await terminal.execCommandSync(action.command);
        } else if (action.type === 'custom-action') {
            console.log(chalk.blue(`Executing custom action: [id: ${action.id} name: ${action.name} ]`));
            // Note: We assume circular dependencies are already checked.
            await executeSequence(action.idList, flatMap);
        } else {
            console.log(chalk.red(`Unknown or unexecutable type for id: ${id}`));
        }
    }
}

module.exports = { executeSequence };
