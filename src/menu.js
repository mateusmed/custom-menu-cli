import inquirer from 'inquirer';
import chalk from 'chalk';
import { handleAction, handleCustomAction, handleNavigation } from './actions.js';

export const flatMap = {};

export function buildIdMap(options) {
    for (const opt of options) {
        flatMap[opt.id] = opt;
        if (opt.options) buildIdMap(opt.options);
    }
}

export async function showMenu(menu) {
    while (true) {
        const choices = menu.options.map(o => `[${o.id}] ${o.name}`).concat([' Back']);
        const { choice } = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: chalk.cyan(menu.name),
            choices
        });

        if (choice === ' Back') return;

        const selected = menu.options.find(o => `[${o.id}] ${o.name}` === choice);
        if (!selected) continue;

        switch (selected.type) {
            case 'action':
                await handleAction(selected);
                break;
            case 'custom-action':
                await handleCustomAction(selected, flatMap);
                break;
            case 'navigation':
                await showMenu(selected);
                break;
            default:
                console.log(chalk.red(`Unknown action type: ${selected.type}`));
        }
    }
}
