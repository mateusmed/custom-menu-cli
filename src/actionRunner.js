const chalk = require('chalk');
const inquirer = require('inquirer');
const { terminal } = require('./terminal.js');

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

/**
 * Handles a single action selected in interactive mode.
 * @param {object} selected - The selected action object.
 * @param {object} flatMap - The map of all available actions.
 */
async function handleAction(selected, flatMap) {
    // For single actions selected in interactive mode, confirmation is enabled.
    await executeAction(selected, flatMap, true);
}

/**
 * Handles a custom action selected in interactive mode.
 * @param {object} selected - The selected custom action object.
 * @param {object} flatMap - The map of all available actions.
 */
async function handleCustomAction(selected, flatMap) {
    // For custom actions selected in interactive mode, confirmation is enabled.
    await executeAction(selected, flatMap, true);
}

/**
 * Executes a sequence of actions triggered from the command line.
 * @param {string[]} actionIds - An array of action IDs to execute.
 * @param {object} flatMap - The map of all available actions.
 */
async function executeSequence(actionIds, flatMap) {
    console.log(chalk.blue(`Executing sequence from command line: ${actionIds.join(', ')}`));

    for (const id of actionIds) {
        const action = flatMap[id];
        if (action) {
            // Call the unified executor with confirmations disabled
            await executeAction(action, flatMap, false);
        } else {
            console.error(chalk.red(`Error: Action with id '${id}' not found.`));
        }
    }
}


module.exports = { handleAction, handleCustomAction, executeSequence };
