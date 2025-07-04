# Custom Menu CLI

[Português (Brasil)](./README-pt.md)

This is a command-line interface (CLI) tool that creates an interactive menu based on a JSON file. It's designed to simplify the execution of frequent commands in a terminal.

## Features

- Interactive menu in the terminal.
- Menu structure defined by a JSON file.
- Easy to configure and use.
- Support for command execution with confirmation.

## Installation

To install this tool globally, run the following command:

```bash
npm install -g custom-menu-cli
```

## Usage

This tool can be used in two ways: as a Command-Line Interface (CLI) tool or programmatically by importing its main function.

### As a CLI Tool

To use the CLI, you can run the `custom-menu-cli` command, optionally passing the path to a JSON file. If no path is provided, it will look for a `menu.json` file in the current directory.

```bash
custom-menu-cli [path/to/your/menu.json]
```

### Programmatic Usage

You can import the `runCli` function from the package and execute it within your own Node.js applications. This allows you to integrate the custom menu functionality into larger scripts or systems.

```javascript
import { runCli } from 'custom-menu-cli';

async function startMyCustomMenu() {
    console.log("Starting custom menu...");
    // Optionally, pass the path to your menu.json file
    await runCli('./path/to/your/menu.json');
    console.log("Custom menu finished.");
}

startMyCustomMenu();
```

## JSON Structure

The JSON file that defines the menu has the following structure:

```json
{
  "name": "Deploy Menu",
  "description": "Menu de navegação para deploys",
  "options": [
    {
      "id": "1",
      "name": "Projeto A",
      "type": "navigation",
      "options": [
        {
          "id": "1.1",
          "name": "Down Service",
          "type": "action",
          "command": "echo 'Down A'",
          "confirm": true
        },
        {
          "id": "1.2",
          "name": "Up Service",
          "type": "action",
          "command": "echo 'Up A'"
        }
      ]
    },
    {
      "id": "2",
      "name": "Restart All",
      "type": "custom-action",
      "idList": ["1.1", "1.2"],
      "confirm": true
    }
  ]
}
```

### Fields

- `name`: The name of the menu.
- `description`: A brief description of the menu.
- `options`: An array of menu options.
    - `id`: A unique identifier for the option.
    - `name`: The text that will be displayed for the option.
    - `type`: The type of option. It can be `action` (executes a command), `navigation` (opens a submenu) or `custom-action` (executes a list of commands from other actions).
    - `command`: The command to be executed (if the type is `action`).
    - `idList`: A list of ids from other actions to be executed (if the type is `custom-action`).
    - `confirm`: A boolean that indicates whether a confirmation should be requested before executing the command.
    - `options`: An array of sub-options (if the type is `navigation`).

## License

This project is licensed under the MIT License.

## Author

- **Mateus Medeiros**
    - GitHub: [@mateusmed](https://github.com/mateusmed)
    - LinkedIn: [Mateus Medeiros](https://www.linkedin.com/in/mateus-med/)
