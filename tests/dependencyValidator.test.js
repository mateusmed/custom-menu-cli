const { validateAllDependencies } = require('../src/dependencyValidator');

describe('dependencyValidator', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        mockExit.mockClear();
        mockConsoleError.mockClear();
    });

    test('should not exit for a valid dependency graph', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'action', command: 'echo b' }
        };
        validateAllDependencies(flatMap);
        expect(mockExit).not.toHaveBeenCalled();
    });

    test('should exit for a simple circular dependency', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['a'] }
        };
        validateAllDependencies(flatMap);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit for a longer circular dependency', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['c'] },
            'c': { id: 'c', type: 'custom-action', idList: ['a'] }
        };
        validateAllDependencies(flatMap);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should exit for a self-referencing dependency', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['a'] }
        };
        validateAllDependencies(flatMap);
        expect(mockExit).toHaveBeenCalledWith(1);
    });

    test('should handle actions with depends_on', () => {
        const flatMap = {
            'a': { id: 'a', type: 'action', command: 'echo a', depends_on: ['b'] },
            'b': { id: 'b', type: 'action', command: 'echo b', depends_on: ['a'] }
        };
        validateAllDependencies(flatMap);
        expect(mockExit).toHaveBeenCalledWith(1);
    });
    
    test('should handle a mix of idList and depends_on', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'action', command: 'echo b', depends_on: ['a'] }
        };
        validateAllDependencies(flatMap);
        expect(mockExit).toHaveBeenCalledWith(1);
    });
});
