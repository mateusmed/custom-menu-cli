const { validateMenu } = require('../src/menuValidator');

describe('menuValidator', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        mockExit.mockClear();
        mockConsoleError.mockClear();
    });

    const validMenu = {
        name: 'Valid Menu',
        options: [
            { id: '1', name: 'Action 1', type: 'action', command: 'echo 1' },
            { id: '2', name: 'Nav 1', type: 'navigation', options: [
                { id: '2.1', name: 'Action 2.1', type: 'action', command: 'echo 2.1' }
            ]},
            { id: '3', name: 'Custom 1', type: 'custom-action', idList: ['1'] }
        ]
    };

    test('should not throw error for a valid menu', () => {
        validateMenu(validMenu);
        expect(mockExit).not.toHaveBeenCalled();
    });

    test('should exit if top-level name is missing', () => {
        const invalidMenu = { ...validMenu, name: undefined };
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit if top-level options is not an array', () => {
        const invalidMenu = { ...validMenu, options: 'not-an-array' };
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit if an option is missing an id', () => {
        const invalidMenu = JSON.parse(JSON.stringify(validMenu)); // Deep copy
        invalidMenu.options[0].id = undefined;
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit if an option is missing a name', () => {
        const invalidMenu = JSON.parse(JSON.stringify(validMenu));
        invalidMenu.options[0].name = undefined;
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit if an action is missing a command', () => {
        const invalidMenu = JSON.parse(JSON.stringify(validMenu));
        invalidMenu.options[0].command = undefined;
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit if a custom-action is missing an idList', () => {
        const invalidMenu = JSON.parse(JSON.stringify(validMenu));
        invalidMenu.options[2].idList = undefined;
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit if a navigation is missing options', () => {
        const invalidMenu = JSON.parse(JSON.stringify(validMenu));
        invalidMenu.options[1].options = undefined;
        validateMenu(invalidMenu);
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});
