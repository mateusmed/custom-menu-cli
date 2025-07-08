const { join } = require('path');
const { config } = require('dotenv');
const { access } = require('fs/promises');
const { execSync } = require('child_process');
const chalk = require('chalk');

config({ path: join(__dirname, '../.env') });

const terminal = {

    async directoryExists(path) {
        try {
            await access(path);
            return true;
        } catch (error) {
            console.log(chalk.red(`❌ Diretório não encontrado: ${path}`));
            return false;
        }
    },

    async execCommandSync(command) {
        try {
            console.log(chalk.yellow(`\n Execute command:\n\t${chalk.bgBlackBright.red(command)}\n`));
            const output = execSync(command, { encoding: 'utf8' });
            console.log(chalk.green(`✅ Command executed with success.\n`));
            if (output.trim()) {
                console.log('--------[output command]-------');
                console.log(chalk.greenBright(output));
                console.log('-------------------------------');
            }
            return output;
        } catch (error) {
            console.error('-------------------');
            console.error(chalk.red(`Error on execute command:`));
            console.error(chalk.red(error.message));
            return `Error: ${error.message}`;
        }
    },

    async execList(list) {
        let output = '';
        console.log(chalk.cyan(`\n Running list of command: (${list.length}):\n`));
        for (let command of list) {
            console.log(chalk.blue(`→ ${command}`));
            const result = await this.execCommandSync(command);
            output += result + '\n';
        }
        return output;
    }

}

module.exports = { terminal };
