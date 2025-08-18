const chalk = require('chalk');

function validateMenuOption(option, filePath) {
    // --- Validation Logic ---
    if (!option.id || typeof option.id !== 'string') {
        console.error(chalk.red(`
Validation Error: 'id' missing or invalid in: ${filePath}`));
        process.exit(1);
    }
    if (!option.name || typeof option.name !== 'string') {
        console.error(chalk.red(`
Validation Error: 'name' missing or invalid in: ${filePath}`));
        process.exit(1);
    }
    const validTypes = ['action', 'navigation', 'custom-action'];
    if (!option.type || typeof option.type !== 'string' || !validTypes.includes(option.type)) {
        console.error(chalk.red(`
Validation Error: 'type' missing or invalid (expected ${validTypes.join(', ')}) in: ${filePath}`));
        process.exit(1);
    }

    if (option.type === 'action') {
        if (!option.command || typeof option.command !== 'string') {
            console.error(chalk.red(`
Validation Error: 'command' missing or invalid for type 'action' in: ${filePath}`));
            process.exit(1);
        }
    } else if (option.type === 'custom-action') {
        if (!Array.isArray(option.idList) || option.idList.length === 0) {
            console.error(chalk.red(`
Validation Error: 'idList' missing or empty for type 'custom-action' in: ${filePath}`));
            process.exit(1);
        }
    } else if (option.type === 'navigation') {
        if (!Array.isArray(option.options) || option.options.length === 0) {
            console.error(chalk.red(`
Validation Error: 'options' missing or empty for type 'navigation' in: ${filePath}. Navigation must come from directories or have sub-options.`));
            process.exit(1);
        }
    }
    // --- End Validation Logic ---
}

module.exports = { validateMenuOption };