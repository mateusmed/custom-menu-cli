#!/usr/bin/env node

const { loadMenuConfig } = require('./src/configLoader.js');
const { showMenu, buildIdMap, flatMap } = require('./src/menu.js');
const { displayHeader } = require('./src/header.js');
const { parseArgs } = require('./src/args.js');
const { executeSequence } = require('./src/actionSequencer.js');
const { validateRecursionDepth } = require('./src/dependencyValidator.js');


const { validateMenu } = require('./src/menuValidator.js');

async function runCli() {
    const { menuPath, customActions } = parseArgs();
    const data = await loadMenuConfig(menuPath);

    // 1. Validate the overall menu structure
    validateMenu(data);

    if (data.options) {
        buildIdMap(data.options);
    }

    validateRecursionDepth(flatMap);

    if (customActions && customActions.length > 0) {
        await executeSequence(customActions, flatMap);
    } else {
        console.clear();
        displayHeader(data);
        await showMenu(data);
    }
}

if (require.main === module) {
    (async () => {
        await runCli();
    })();
}

module.exports = { runCli };
