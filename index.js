#!/usr/bin/env node

import { loadMenuConfig } from './src/configLoader.js';
import { showMenu, buildIdMap } from './src/menu.js';
import { displayHeader } from './src/header.js';
import { fileURLToPath } from 'url';

export async function runCli(menuPath = null) {
    const data = loadMenuConfig(menuPath);
    if (data.options) {
        buildIdMap(data.options);
    }

    console.clear();

    displayHeader(data);

    await showMenu(data);
}


if (process.argv[1] === fileURLToPath(import.meta.url)) {
    runCli();
}
