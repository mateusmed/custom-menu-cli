const fs = require('fs');
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

function loadMenuConfig(menuPath = null) {
    let data;
    let finalPath = menuPath;

    // If menuPath is not provided, check command line arguments
    if (!finalPath) {
        const args = process.argv.slice(2);
        finalPath = args[0];
    }

    if (finalPath && fs.existsSync(finalPath)) {
        try {
            data = JSON.parse(fs.readFileSync(finalPath, 'utf-8'));
        } catch (error) {
            console.log(chalk.red(`Error parsing JSON file: ${finalPath}`));
            console.error(error);
            process.exit(1);
        }
    } else if (finalPath) {
        console.log(chalk.red(`File not found: ${finalPath}`));
        process.exit(1);
    } else if (fs.existsSync('./menu.json')) {
        try {
            data = JSON.parse(fs.readFileSync('./menu.json', 'utf-8'));
        } catch (error) {
            console.log(chalk.red(`Error parsing JSON file: ./menu.json`));
            console.error(error);
            process.exit(1);
        }
    } else {
        console.log(chalk.yellow("No 'menu.json' found. Loading example menu."));
        data = defaultMenu;
    }

    return data;
}

module.exports = { loadMenuConfig };
