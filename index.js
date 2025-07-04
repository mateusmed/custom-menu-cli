#!/usr/bin/env node
import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs';


import { terminal } from './src/terminal.js';

const data = JSON.parse(fs.readFileSync('./menu.json', 'utf-8'));
const flatMap = {};

function buildIdMap(options) {
    for (const opt of options) {
        flatMap[opt.id] = opt;
        if (opt.options) buildIdMap(opt.options);
    }
}
buildIdMap(data.options);

async function showMenu(menu) {

    while (true) {
        const choices = menu.options.map(o => o.name).concat([' Back']);
        const { choice } = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: chalk.cyan(menu.name),
            choices
        });

        if (choice === ' Back') return;

        const selected = menu.options.find(o => o.name === choice);
        if (!selected) continue;

        if (selected.type === 'navigation') {
            await showMenu(selected);
        }

        if (selected.type === 'action') {
            const proceed = selected.confirm
                ? (await inquirer.prompt({
                    type: 'confirm',
                    name: 'ok',
                    message: chalk.yellow(`Excute command: "${selected.command}"?`),
                    default: false
                })).ok
                : true;

            if (proceed) await terminal.execCommandSync(selected.command);
        }

        if (selected.type === 'custom-action') {
            const proceed = selected.confirm
                ? (await inquirer.prompt({
                    type: 'confirm',
                    name: 'ok',
                    message: chalk.yellow(`Execute command list ${selected.idList.join(', ')}?`),
                    default: false
                })).ok
                : true;

            if (proceed) {
                for (const id of selected.idList) {
                    const cmd = flatMap[id];
                    if (cmd?.command) {
                        console.log(chalk.blue(`\n Execute command: ${cmd.name}`));
                        await terminal.execCommandSync(cmd.command);
                    }
                }
            }
        }
    }
}

(async () => {
    console.clear();
    console.log(chalk.bold.blueBright(`📦 ${data.name}`));
    console.log(chalk.gray(data.description));
    await showMenu(data);
})();
