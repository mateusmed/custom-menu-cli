const chalk = require('chalk');


function validateRecursionDepth(flatMap, maxDepth = 3) {
    const graph = new Map();
    const allActions = Object.values(flatMap);

    for (const action of allActions) {
        if (action.type === 'custom-action' && action.idList) {
            graph.set(action.id, action.idList);
        }
    }

    function checkDepth(actionId, currentDepth, path) {
        if (currentDepth > maxDepth) {
            console.error(chalk.red(`Error: Maximum recursion depth of ${maxDepth} exceeded by action '${path[0]}'. Path: ${path.join(' -> ')} -> ${actionId}`));
            process.exit(1);
        }

        if (path.includes(actionId)) {
            // This is a circular dependency. If it reached here, it didn't exceed maxDepth on previous checks
            // So, for now, we just acknowledge it and don't exit.
            // If the *cycle itself* is considered a depth violation (e.g., a->b->a, depth 3 for second 'a'),
            // the check above (currentDepth > maxDepth) should catch it if the cycle is long enough.
            return;
        }

        path.push(actionId);

        const dependencies = graph.get(actionId) || [];
        for (const depId of dependencies) {
            checkDepth(depId, currentDepth + 1, [...path]); // Pass a copy of the path
        }
    }

    for (const actionId of graph.keys()) {
        checkDepth(actionId, 1, []);
    }
}

module.exports = { validateRecursionDepth };
