const { runCli } = require('../index.js');
const { loadMenuConfig } = require('../src/configLoader.js');
const { showMenu, buildIdMap, flatMap } = require('../src/menu.js');
const { displayHeader } = require('../src/header.js');
const { parseArgs } = require('../src/args.js');
const { validateRecursionDepth } = require('../src/dependencyValidator.js');
const { executeSequence } = require('../src/actionRunner.js');
const { validateMenu } = require('../src/menuValidator.js');

jest.mock('../src/configLoader.js');
jest.mock('../src/menu.js');
jest.mock('../src/header.js');
jest.mock('../src/args.js');
jest.mock('../src/dependencyValidator.js');
jest.mock('../src/actionRunner.js');
jest.mock('../src/menuValidator.js');

describe('runCli', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Default mock implementations to avoid crashes
        parseArgs.mockReturnValue({ menuPath: null, customActions: [] });
        loadMenuConfig.mockResolvedValue({ options: [] });
    });

    test('should use providedMenuPath when passed', async () => {
        const providedPath = './custom-menu.json';
        await runCli(providedPath);

        expect(loadMenuConfig).toHaveBeenCalledWith(providedPath);
    });

    test('should use menuPath from args if providedMenuPath is not passed', async () => {
        const argPath = './arg-menu.json';
        parseArgs.mockReturnValue({ menuPath: argPath, customActions: [] });
        
        await runCli();

        expect(loadMenuConfig).toHaveBeenCalledWith(argPath);
    });

    test('should executeSequence when customActions are present', async () => {
        const customActions = ['action1', 'action2'];
        parseArgs.mockReturnValue({ menuPath: null, customActions });
        
        await runCli();

        expect(executeSequence).toHaveBeenCalledWith(customActions, flatMap);
        expect(showMenu).not.toHaveBeenCalled();
    });

    test('should showMenu when no customActions are present', async () => {
        // Mock console.clear to avoid cluttering test output
        const originalConsoleClear = console.clear;
        console.clear = jest.fn();

        parseArgs.mockReturnValue({ menuPath: null, customActions: [] });
        
        await runCli();

        expect(showMenu).toHaveBeenCalled();
        expect(executeSequence).not.toHaveBeenCalled();

        // Restore console.clear
        console.clear = originalConsoleClear;
    });

    test('should validate menu and recursion depth', async () => {
        const mockData = { options: [{ id: '1' }] };
        loadMenuConfig.mockResolvedValue(mockData);

        await runCli();

        expect(validateMenu).toHaveBeenCalledWith(mockData);
        expect(buildIdMap).toHaveBeenCalledWith(mockData.options);
        expect(validateRecursionDepth).toHaveBeenCalledWith(flatMap);
    });
});
