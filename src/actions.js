const { executeAction } = require('./actionExecutor.js');

async function handleAction(selected, flatMap) {
    // For single actions selected in interactive mode, confirmation is enabled.
    await executeAction(selected, flatMap, true);
}

async function handleCustomAction(selected, flatMap) {
    // For custom actions selected in interactive mode, confirmation is enabled.
    await executeAction(selected, flatMap, true);
}

async function handleNavigation(selected) {
    return selected;
}

module.exports = { handleAction, handleCustomAction, handleNavigation };