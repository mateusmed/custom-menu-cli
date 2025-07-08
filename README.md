# Custom Menu CLI

[Português (Brasil)](./README-pt.md)

![Menu Example 1](./docs/example1.png)
![Menu Example 2](./docs/example2.png)

This is a command-line interface (CLI) tool that creates an interactive menu based on a JSON file. It's designed to simplify the execution of frequent commands in a terminal.

## Features

- Interactive menu in the terminal.
- Menu structure defined by a JSON file.
- Easy to configure and use.
- Support for command execution with confirmation.

## Releases

You can find all released versions and pre-compiled standalone executables on the [GitHub Releases page](https://github.com/mateusmed/custom-menu-cli/releases).


## Installation

To install this tool globally, run the following command:

```bash
npm install -g custom-menu-cli
```

## Usage

There are three main ways to use this tool:

### 1. As an Executable (Release Build)

You can generate executables for Linux, macOS, and Windows. After the build, the files will be in the `dist/` folder.

First, generate the files with the command:

```bash
npm run build
```

Then, run the file corresponding to your operating system, optionally passing the path to a menu file. If no path is provided, it will look for a `menu.json` in the current directory.

```bash
# On Linux/macOS
./dist/custom-menu-linux [path/to/your/menu.json]

# On Windows
.\dist\custom-menu-win.exe [path\to\your\menu.json]
```

### 2. Globally via NPM

Install the package globally to use the `custom-menu-cli` command anywhere on your system.

```bash
npm install -g custom-menu-cli
```

Once installed, run the command:

```bash
custom-menu-cli [path/to/your/menu.json]
```

### 3. Programmatically via `require`

You can import the `runCli` function into your own Node.js projects to integrate the menu functionality.

First, add the package as a dependency to your project:
```bash
npm install custom-menu-cli
```

Then, use it in your code:

```javascript
const { runCli } = require('custom-menu-cli');

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
  "name": "custom-menu-cli",
  "description": "JSON-based terminal menu",
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
        },
        {
          "id": "1.3",
          "name": "Restart Project A (from inside)",
          "type": "custom-action",
          "idList": ["1.1", "1.2"],
          "confirm": true
        }
      ]
    },
    {
      "id": "2",
      "name": "Restart All",
      "type": "custom-action",
      "idList": ["1.1", "1.2"],
      "confirm": true
    },
    {
      "id": "3",
      "name": "Restart Project A (Nested)",
      "type": "custom-action",
      "idList": ["1.3"],
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
