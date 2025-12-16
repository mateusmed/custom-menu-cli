const chalk = require('chalk');
const { executeAction } = require('./actionExecutor.js');

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

module.exports = { executeSequence };
