const chalk = require('chalk');

function validateAllDependencies(flatMap) {
    const graph = new Map();
    const allActions = Object.values(flatMap);

    for (const action of allActions) {
        if (action.type === 'custom-action' && action.idList) {
            graph.set(action.id, action.idList);
        } else if (action.type === 'action' && action.depends_on) {
            graph.set(action.id, Array.isArray(action.depends_on) ? action.depends_on : [action.depends_on]);
        }
    }

    const visiting = new Set();
    const visited = new Set();

    function findCycle(actionId, path = []) {
        visiting.add(actionId);
        path.push(actionId);

        const dependencies = graph.get(actionId) || [];

        for (const depId of dependencies) {
            if (path.includes(depId)) {
                return [...path, depId]; // Cycle detected
            }
            if (visiting.has(depId)) {
                return path.slice(path.indexOf(depId)); // Cycle detected
            }
            if (!visited.has(depId)) {
                const cycle = findCycle(depId, [...path]);
                if (cycle) {
                    return cycle;
                }
            }
        }

        visiting.delete(actionId);
        visited.add(actionId);
        return null;
    }

    for (const actionId of graph.keys()) {
        if (!visited.has(actionId)) {
            const cycle = findCycle(actionId);
            if (cycle) {
                console.error(chalk.red(`Error: Circular dependency detected: ${cycle.join(' -> ')}`));
                process.exit(1);
            }
        }
    }
}

module.exports = { validateAllDependencies };
