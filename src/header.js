const chalk = require('chalk');

function displayHeader(data) {
    const name = data.name || 'Custom Menu';
    const description = data.description || 'A CLI Menu';
    const lines = [name, description];
    const maxLength = Math.max(...lines.map(line => line.length));
    const boxWidth = maxLength + 4;

    const topBorder = '╔' + '═'.repeat(boxWidth) + '╗';
    const bottomBorder = '╚' + '═'.repeat(boxWidth) + '╝';

    console.log(chalk.bold.blueBright(topBorder));
    lines.forEach(line => {
        const paddingTotal = boxWidth - line.length;
        const paddingLeft = Math.floor(paddingTotal / 2);
        const paddingRight = Math.ceil(paddingTotal / 2);
        const paddedLine = `║${' '.repeat(paddingLeft)}${line}${' '.repeat(paddingRight)}║`;
        console.log(chalk.bold.blueBright(paddedLine));
    });
    console.log(chalk.bold.blueBright(bottomBorder));
    console.log('');
    console.log(chalk.gray(`Developed by Mateus Medeiros - GitHub: @mateusmed`));
    console.log('');
}

module.exports = { displayHeader };
