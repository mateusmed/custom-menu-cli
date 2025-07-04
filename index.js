#!/usr/bin/env node
import chalk from 'chalk';
import { loadMenuConfig } from './src/configLoader.js';
import { showMenu, buildIdMap } from './src/menu.js';

(async () => {
    const data = loadMenuConfig();
    if (data.options) {
        buildIdMap(data.options);
    }

    console.clear();

    // Dynamic Header
    const name = data.name || 'Custom Menu';
    const description = data.description || 'A CLI Menu';
    const lines = [name, description];
    const maxLength = Math.max(...lines.map(line => line.length));
    const boxWidth = maxLength + 4;

    const topBorder = '╔' + '═'.repeat(boxWidth) + '╗';
    const bottomBorder = '╚' + '═'.repeat(boxWidth) + '╝';

    console.log(chalk.bold.blueBright(topBorder));
    lines.forEach(line => {
        const paddingTotal = boxWidth - line.length;
        const paddingLeft = Math.floor(paddingTotal / 2);
        const paddingRight = Math.ceil(paddingTotal / 2);
        const paddedLine = `║${' '.repeat(paddingLeft)}${line}${' '.repeat(paddingRight)}║`;
        console.log(chalk.bold.blueBright(paddedLine));
    });
    console.log(chalk.bold.blueBright(bottomBorder));
    console.log(''); // For spacing

    await showMenu(data);
})();
