#!/usr/bin/env node
import chalk from 'chalk';
import { loadMenuConfig } from './src/configLoader.js';
import { showMenu, buildIdMap } from './src/menu.js';

(async () => {
    const data = loadMenuConfig();
    buildIdMap(data.options);

    console.clear();
    console.log(chalk.bold.blueBright(`
  
        ╔═══════════════════════════════╗
        ║       custom-menu-cli         ║
        ║    JSON-based Terminal Menu   ║
        ╚═══════════════════════════════╝

    `));

    console.log(chalk.bold.blueBright(`📦 ${data.name}`));
    console.log(chalk.gray(data.description));
    
    await showMenu(data);
})();
