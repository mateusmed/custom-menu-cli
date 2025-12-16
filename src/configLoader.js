const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');

const defaultMenu = {
    "name": "Example Menu",
    "description": "This is a default example menu. Create a 'menu.json' to customize.",
    "options": [
        {
            "id": "hello",
            "name": "Say Hello",
            "type": "action",
            "command": "echo 'Hello, World!'",
            "confirm": false
        }
    ]
};

async function buildMenuOptions(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const options = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            const subOptions = await buildMenuOptions(fullPath);
            options.push({
                id: entry.name,
                name: `=> ${entry.name.toUpperCase()}`,
                type: 'navigation',
                options: subOptions
            });
        } else if (entry.isFile() && entry.name.endsWith('.json')) {
            const fileContent = await fs.readFile(fullPath, 'utf-8');
            try {
                const option = JSON.parse(fileContent);
                options.push(option);
            } catch (parseError) {
                console.error(chalk.red(`Error: Malformed JSON file at: ${fullPath}`));
                console.error(chalk.red(`Details: ${parseError.message}`));
                process.exit(1);
            }
        }
    }
    return options;
}

async function loadMenuConfig(menuPath = null) {
    if (menuPath) {
        try {
            const stats = await fs.stat(menuPath);
            if (stats.isDirectory()) {
                return {
                    name: "Dynamic Menu",
                    description: `Menu generated from folder: ${menuPath}`,
                    options: await buildMenuOptions(menuPath)
                };
            }
            return JSON.parse(await fs.readFile(menuPath, 'utf-8'));
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.error(chalk.red(`Error: The path '${menuPath}' was not found.`));
            } else {
                console.error(chalk.red(`Error processing path: ${menuPath}`));
                console.error(error);
            }
            process.exit(1);
        }
    }

    // Default to menu.json or example menu
    const defaultMenuPath = './menu.json';
    try {
        const fileContent = await fs.readFile(defaultMenuPath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(chalk.yellow("No 'menu.json' found. Loading example menu."));
            return defaultMenu;
        }
        console.error(chalk.red(`Error loading default menu.json: ${error.message}`));
        process.exit(1);
    }
}

module.exports = { loadMenuConfig };
