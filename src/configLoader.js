import fs from 'fs';
import chalk from 'chalk';

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

export function loadMenuConfig() {
    const args = process.argv.slice(2);
    const path = args[0];
    let data;

    if (path && fs.existsSync(path)) {
        try {
            data = JSON.parse(fs.readFileSync(path, 'utf-8'));
        } catch (error) {
            console.log(chalk.red(`Error parsing JSON file: ${path}`));
            console.error(error);
            process.exit(1);
        }
        return;
    }

    if (path) {
        console.log(chalk.red(`File not found: ${path}`));
        process.exit(1);
        return;
    }

    if (fs.existsSync('./menu.json')) {
        try {
            data = JSON.parse(fs.readFileSync('./menu.json', 'utf-8'));
        } catch (error) {
            console.log(chalk.red(`Error parsing JSON file: ./menu.json`));
            console.error(error);
            process.exit(1);
        }
        return ;
    }

    console.log(chalk.yellow("No 'menu.json' found. Loading example menu."));
    data = defaultMenu;

    return data;
}
