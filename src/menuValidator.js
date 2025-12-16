const chalk = require('chalk');

function _validateSingleOption(option) {
    if (!option.id || typeof option.id !== 'string') {
        console.error(chalk.red(`Validation Error: An option is missing a valid 'id'.`));
        process.exit(1);
    }
    if (!option.name || typeof option.name !== 'string') {
        console.error(chalk.red(`Validation Error in option '${option.id}': 'name' is missing or invalid.`));
        process.exit(1);
    }

    const validTypes = ['action', 'navigation', 'custom-action'];
    if (!option.type || !validTypes.includes(option.type)) {
        console.error(chalk.red(`Validation Error in option '${option.id}': 'type' is missing or invalid.`));
        process.exit(1);
    }

    if (option.type === 'action') {
        if (!option.command || typeof option.command !== 'string') {
            console.error(chalk.red(`Validation Error in option '${option.id}': 'command' is missing or invalid for type 'action'.`));
            process.exit(1);
        }
    } else if (option.type === 'custom-action') {
        if (!Array.isArray(option.idList) || option.idList.length === 0) {
            console.error(chalk.red(`Validation Error in option '${option.id}': 'idList' is missing or empty for type 'custom-action'.`));
            process.exit(1);
        }
    } else if (option.type === 'navigation') {
        if (!Array.isArray(option.options) || option.options.length === 0) {
            console.error(chalk.red(`Validation Error in option '${option.id}': 'options' is missing or empty for type 'navigation'.`));
            process.exit(1);
        }
        // Recursively validate sub-options
        option.options.forEach(_validateSingleOption);
    }
}

function validateMenu(menuData) {
    if (!menuData.name || typeof menuData.name !== 'string') {
        console.error(chalk.red(`Validation Error: Top-level 'name' is missing or invalid in menu configuration.`));
        process.exit(1);
    }
    if (!Array.isArray(menuData.options)) {
        console.error(chalk.red(`Validation Error: Top-level 'options' array is missing or invalid.`));
        process.exit(1);
    }
    menuData.options.forEach(_validateSingleOption);
}

module.exports = { validateMenu };