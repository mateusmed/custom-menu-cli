const chalk = require('chalk');
const { terminal } = require('./terminal.js');

function detectCircularDependencies(actionIds, flatMap) {
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

    function hasCycle(actionId, path) {
        visiting.add(actionId);
        path.push(actionId);

        const dependencies = graph.get(actionId) || [];
        for (const depId of dependencies) {
            if (path.includes(depId)) {
                return [...path, depId];
            }
            if (visiting.has(depId)) {
                // Cycle detected
                return path.slice(path.indexOf(depId));
            }
            if (!visited.has(depId)) {
                const cycle = hasCycle(depId, [...path]);
                if (cycle) {
                    return cycle;
                }
            }
        }

        visiting.delete(actionId);
        visited.add(actionId);
        return null;
    }

    for (const id of actionIds) {
        const cycle = hasCycle(id, []);
        if (cycle) {
            return cycle;
        }
    }

    return null;
}

async function executeSequence(actionIds, flatMap) {
    const circularDependency = detectCircularDependencies(actionIds, flatMap);
    if (circularDependency) {
        console.error(chalk.red(`Error: Circular dependency detected: ${circularDependency.join(' -> ')}`));
        process.exit(1);
    }

    console.log(chalk.blue(`Executing sequence: ${actionIds.join(', ')}`));

    for (const id of actionIds) {
        const action = flatMap[id];
        if (!action) {
            console.error(chalk.red(`Error: Action with id '${id}' not found.`));
            continue;
        }

        if (action.type === 'action' && action.command) {
            console.log(chalk.blue(`Executing command: [id: ${action.id} name: ${action.name} ]`));
            await terminal.execCommandSync(action.command);
        } else if (action.type === 'custom-action') {
            console.log(chalk.blue(`Executing custom action: [id: ${action.id} name: ${action.name} ]`));
            await executeSequence(action.idList, flatMap);
        } else {
            console.log(chalk.red(`Unknown or unexecutable type for id: ${id}`));
        }
    }
}

module.exports = { executeSequence };
