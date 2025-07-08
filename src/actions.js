const inquirer = require('inquirer');
const chalk = require('chalk');
const {terminal} = require('./terminal.js');

async function confirmExecution(message) {
    const {ok} = await inquirer.prompt({type: 'confirm', name: 'ok', message, default: false});
    return ok;
}

async function handleAction(selected) {
    const proceed = selected.confirm ? await confirmExecution(chalk.yellow(`Executing command: [id: ${selected.id} name: ${selected.name} ]`)) : true;
    if (proceed) {
        await terminal.execCommandSync(selected.command);
    }
}

async function handleCustomAction(selected, flatMap, depth = 0) {
    if (depth >= 3) {
        console.log(chalk.red(`Maximum recursion depth (3) exceeded for custom action: ${selected.id}`));
        return;
    }
    const proceed = selected.confirm ? await confirmExecution(chalk.yellow(`Execute command list ${selected.idList.join(', ')}?`)) : true;
    if (proceed) {
        for (const id of selected.idList) {
            const cmd = flatMap[id];
            if (cmd) {
                if (cmd.type === 'action' && cmd.command) {
                    console.log(chalk.blue(`Executing command: [id: ${cmd.id} name: ${cmd.name} ]`));
                    await terminal.execCommandSync(cmd.command);
                } else if (cmd.type === 'custom-action') {
                    console.log(chalk.blue(`Executing custom action: [id: ${cmd.id} name: ${cmd.name} ]`));
                    await handleCustomAction(cmd, flatMap, depth + 1);
                } else {
                    console.log(chalk.red(`Unknown or unexecutable type for id: ${cmd.id}`));
                }
            }
        }
    }
}

async function handleNavigation(selected) {
    return selected;
}

module.exports = { handleAction, handleCustomAction, handleNavigation };