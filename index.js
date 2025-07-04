#!/usr/bin/env node
import chalk from 'chalk';
import { loadMenuConfig } from './src/configLoader.js';
import { showMenu, buildIdMap } from './src/menu.js';

(async () => {
    const data = loadMenuConfig();
    buildIdMap(data.options);

    console.clear();
    console.log(chalk.bold.blueBright(`
  ____ ____ ____ ____ ____ ____ ____ ____ ____ ____ 
 ||C |||u |||s |||t |||o |||m |||  |||M |||e |||n ||
 ||__|||__|||__|||__|||__|||__|||__|||__|||__|||__|| 
 |/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\|/__\| 

`));
    console.log(chalk.bold.blueBright(`📦 ${data.name}`));
    console.log(chalk.gray(data.description));
    
    await showMenu(data);
})();
