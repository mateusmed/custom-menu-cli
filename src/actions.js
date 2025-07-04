import inquirer from 'inquirer';
import chalk from 'chalk';
import {terminal} from './terminal.js';

async function confirmExecution(message) {
    const {ok} = await inquirer.prompt({type: 'confirm', name: 'ok', message, default: false});
    return ok;
}

export async function handleAction(selected) {
    const proceed = selected.confirm ? await confirmExecution(chalk.yellow(`Execute command: "${selected.command}"?`)) : true;
    if (proceed) {
        await terminal.execCommandSync(selected.command);
    }
}

export async function handleCustomAction(selected, flatMap) {
    const proceed = selected.confirm ? await confirmExecution(chalk.yellow(`Execute command list ${selected.idList.join(', ')}?`)) : true;
    if (proceed) {
        for (const id of selected.idList) {
            const cmd = flatMap[id];
            if (cmd?.command) {
                console.log(chalk.blue(`Executing command: ${cmd.name}`));
                await terminal.execCommandSync(cmd.command);
            }
        }
    }
}

export async function handleNavigation(selected) {
    return selected;
}