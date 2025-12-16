const { validateRecursionDepth } = require('../src/dependencyValidator');

describe('validateRecursionDepth', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

    beforeEach(() => {
        mockExit.mockClear();
        mockConsoleError.mockClear();
    });

    test('should not exit for a valid dependency graph within default recursion depth', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['c'] },
            'c': { id: 'c', type: 'action', command: 'echo c' }
        };
        // Default maxDepth is 3. a -> b (depth 1), b -> c (depth 2), c (depth 3)
        validateRecursionDepth(flatMap);
        expect(mockExit).not.toHaveBeenCalled();
    });

    test('should exit when recursion depth is exceeded by default (depth > 3)', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['c'] },
            'c': { id: 'c', type: 'custom-action', idList: ['d'] },
            'd': { id: 'd', type: 'action', command: 'echo d' }
        };
        // Default maxDepth is 3. a -> b (1) -> c (2) -> d (3)
        // If d refers to another custom action, it would exceed depth.
        // Let's create a chain that explicitly exceeds default maxDepth=3.
        const deepFlatMap = {
            'action0': { id: 'action0', type: 'custom-action', idList: ['action1'] },
            'action1': { id: 'action1', type: 'custom-action', idList: ['action2'] },
            'action2': { id: 'action2', type: 'custom-action', idList: ['action3'] },
            'action3': { id: 'action3', type: 'custom-action', idList: ['action4'] },
            'action4': { id: 'action4', type: 'action', command: 'echo hello' }
        };
        validateRecursionDepth(deepFlatMap);
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Maximum recursion depth of 3 exceeded by action \'action0\'. Path: action0 -> action1 -> action2 -> action3 -> action4'));
    });

    test('should not exit for a valid dependency graph within custom recursion depth', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['c'] },
            'c': { id: 'c', type: 'action', command: 'echo c' }
        };
        // Testing with maxDepth = 4, which should pass
        validateRecursionDepth(flatMap, 4);
        expect(mockExit).not.toHaveBeenCalled();
    });

    test('should exit when custom recursion depth is exceeded', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['c'] },
            'c': { id: 'c', type: 'action', command: 'echo c' }
        };
        // Testing with maxDepth = 2, which should fail at 'b'
        validateRecursionDepth(flatMap, 2);
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Maximum recursion depth of 2 exceeded by action \'a\'. Path: a -> b -> c'));
    });

    test('should handle circular dependencies that are within maxDepth without exiting', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['a'] }
        };
        // A circular dependency, but if default maxDepth is 3, it should not exit based *solely* on depth
        // The current implementation of validateRecursionDepth detects depth exceeding, not general cycles.
        // In this case, `checkDepth` for 'a' with 'b' at depth 1, then 'b' with 'a' at depth 2,
        // will not exceed the default maxDepth of 3.
        validateRecursionDepth(flatMap, 3); // maxDepth 3
        expect(mockExit).not.toHaveBeenCalled();
    });

    test('should exit for a circular dependency that exceeds maxDepth', () => {
        const flatMap = {
            'a': { id: 'a', type: 'custom-action', idList: ['b'] },
            'b': { id: 'b', type: 'custom-action', idList: ['c'] },
            'c': { id: 'c', type: 'custom-action', idList: ['a'] }
        };
        // With maxDepth = 2, 'a' -> 'b' (depth 1), 'b' -> 'c' (depth 2). When 'c' tries to go to 'a',
        // the path 'a' -> 'b' -> 'c' -> 'a' would be depth 3 for the second 'a'.
        validateRecursionDepth(flatMap, 2);
        expect(mockExit).toHaveBeenCalledWith(1);
        expect(mockConsoleError).toHaveBeenCalledWith(expect.stringContaining('Maximum recursion depth of 2 exceeded by action \'a\'. Path: a -> b -> c -> a'));
    });
});
