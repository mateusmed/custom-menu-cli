import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';
import { access } from 'fs/promises';
import { execSync } from 'child_process';
import chalk from 'chalk';

// Resolver o caminho corretamente
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente do arquivo .env na pasta 'node'
config({ path: join(__dirname, '../.env') });

export const terminal = {

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
            console.log(chalk.yellow(`\n⚙️  Executando comando:\n${chalk.gray(command)}\n`));
            const output = execSync(command, { encoding: 'utf8' });
            console.log(chalk.green(`✅ Comando concluído com sucesso.\n`));
            if (output.trim()) {
                console.log('-------------------');
                console.log(chalk.gray(output));
            }
            return output;
        } catch (error) {
            console.error('-------------------');
            console.error(chalk.red(`❌ Erro ao executar comando:`));
            console.error(chalk.red(error.message));
            return `Error: ${error.message}`;
        }
    },

    async execList(list) {
        let output = '';
        console.log(chalk.cyan(`\n🔁 Executando lista de comandos (${list.length}):\n`));
        for (let command of list) {
            console.log(chalk.blue(`→ ${command}`));
            const result = await this.execCommandSync(command);
            output += result + '\n';
        }
        return output;
    }

}
