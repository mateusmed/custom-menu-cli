const chalk = require('chalk');
const { terminal } = require('./terminal.js');
const inquirer = require('inquirer');

async function confirmExecution(message) {
    const { ok } = await inquirer.prompt([{ type: 'confirm', name: 'ok', message, default: false }]);
    return ok;
}

/**
 * Executes a single action or a sequence of actions from a custom-action.
 * @param {object} action - The action object to execute.
 * @param {object} flatMap - The map of all available actions.
 * @param {boolean} [isConfirmationEnabled=true] - Whether to prompt for confirmation.
 */
async function executeAction(action, flatMap, isConfirmationEnabled = true) {
    if (!action) {
        console.error(chalk.red('Error: Attempted to execute a null or undefined action.'));
        return;
    }

    let proceed = true;
    if (isConfirmationEnabled && action.confirm) {
        const message = action.type === 'action'
            ? `Execute command: [id: ${action.id} name: ${action.name} ]?`
            : `Execute custom action: [id: ${action.id} name: ${action.name} ]?`;
        proceed = await confirmExecution(chalk.yellow(message));
    }

    if (!proceed) {
        console.log(chalk.yellow(`Execution of action '${action.id}' cancelled.`));
        return;
    }

    if (action.type === 'action' && action.command) {
        console.log(chalk.blue(`Executing command: [id: ${action.id} name: ${action.name} ]`));
        await terminal.execCommandSync(action.command);
    } else if (action.type === 'custom-action' && action.idList) {
        for (const nestedId of action.idList) {
            const nestedAction = flatMap[nestedId];
            if (nestedAction) {
                // Pass `isConfirmationEnabled=false` to prevent repeated prompts for sub-actions.
                // The parent confirmation is considered sufficient.
                await executeAction(nestedAction, flatMap, false);
            } else {
                console.error(chalk.red(`Error: Nested action with id '${nestedId}' not found within custom-action '${action.id}'.`));
            }
        }
    }
}

module.exports = { executeAction };
