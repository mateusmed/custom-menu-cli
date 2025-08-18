const fs = require('fs').promises;
const path = require('path');
const chalk = require('chalk');
const { validateMenuOption } = require('./menuValidator.js'); // Importar o validador

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
            let option;
            try {
                option = JSON.parse(fileContent);
            } catch (parseError) {
                console.error(chalk.red(`Erro: Arquivo JSON malformado em: ${fullPath}`));
                console.error(chalk.red(`Detalhes: ${parseError.message}`));
                process.exit(1);
            }

            validateMenuOption(option, fullPath); // Chamar o validador

            options.push(option);
        }
    }
    return options;
}

async function loadMenuConfig(menuPath = null) {
    let data;
    let finalPath = menuPath;

    // If menuPath is not provided, check command line arguments
    if (!finalPath) {
        const args = process.argv.slice(2);
        finalPath = args[0];
    }

    if (finalPath) {
        try {
            const stats = await fs.stat(finalPath);
            if (stats.isDirectory()) {
                data = {
                    name: "Dynamic Menu",
                    description: `Menu generated from folder: ${finalPath}`,
                    options: await buildMenuOptions(finalPath)
                };
            } else { // It's a file
                data = JSON.parse(await fs.readFile(finalPath, 'utf-8'));
                validateMenuOption(data, finalPath); // Validar menu de arquivo único também
            }
        } catch (error) {
            console.log(chalk.red(`Erro ao processar o caminho: ${finalPath}`));
            console.error(error);
            process.exit(1);
        }
    } else if (fs.existsSync('./menu.json')) { // This part remains sync for now
        try {
            data = JSON.parse(fs.readFileSync('./menu.json', 'utf-8'));
            validateMenuOption(data, './menu.json'); // Validar menu.json padrão
        } catch (error) {
            console.log(chalk.red(`Erro ao analisar o arquivo JSON: ./menu.json`));
            console.error(error);
            process.exit(1);
        }
    } else {
        console.log(chalk.yellow("Nenhum 'menu.json' encontrado. Carregando menu de exemplo."));
        data = defaultMenu;
    }

    return data;
}

module.exports = { loadMenuConfig };
