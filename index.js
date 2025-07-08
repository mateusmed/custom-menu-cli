#!/usr/bin/env node

const { loadMenuConfig } = require('./src/configLoader.js');
const { showMenu, buildIdMap } = require('./src/menu.js');
const { displayHeader } = require('./src/header.js');

async function runCli(menuPath = null) {
    const data = loadMenuConfig(menuPath);
    if (data.options) {
        buildIdMap(data.options);
    }

    console.clear();

    displayHeader(data);

    await showMenu(data);
}

if (require.main === module) {
    runCli();
}

module.exports = { runCli };
