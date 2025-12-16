
function parseArgs() {
    const args = process.argv.slice(2);
    const result = {
        menuPath: null,
        customActions: [],
    };

    for (const arg of args) {
        if (arg.startsWith('menu=')) {
            result.menuPath = arg.substring('menu='.length);
        } else if (arg.startsWith('custom-action=')) {
            result.customActions = arg.substring('custom-action='.length).split(',');
        } else if (!result.menuPath) {
            // For backward compatibility, if no prefix is used, assume it's a menu path.
            result.menuPath = arg;
        }
    }

    return result;
}

module.exports = { parseArgs };
