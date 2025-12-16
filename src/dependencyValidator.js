const chalk = require('chalk');


function validateRecursionDepth(flatMap, maxDepth = 3) {

    const graph = new Map();
    const allActions = Object.values(flatMap);

    for (const action of allActions) {
        if (action.type === 'custom-action' && action.idList) {
            graph.set(action.id, action.idList);
        }
    }

    function checkDepth(actionId, currentDepth) {
        if (currentDepth > maxDepth) {
            return true; // Exceeded depth
        }

        const dependencies = graph.get(actionId) || [];
        for (const depId of dependencies) {
            if (checkDepth(depId, currentDepth + 1)) {
                console.error(chalk.red(`Error: Maximum recursion depth of ${maxDepth} exceeded by action '${actionId}'.`));
                process.exit(1);
            }
        }
        return false;
    }

    for (const actionId of graph.keys()) {
        checkDepth(actionId, 1);
    }
}

module.exports = { validateRecursionDepth };
