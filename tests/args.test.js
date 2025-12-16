const { parseArgs } = require('../src/args');

describe('args', () => {
    const originalArgv = process.argv;

    afterEach(() => {
        process.argv = originalArgv;
    });

    test('should parse menu path and custom actions', () => {
        process.argv = ['node', 'index.js', 'menu=my-menu.json', 'custom-action=1,2,3'];
        const { menuPath, customActions } = parseArgs();
        expect(menuPath).toBe('my-menu.json');
        expect(customActions).toEqual(['1', '2', '3']);
    });

    test('should handle only menu path', () => {
        process.argv = ['node', 'index.js', 'menu=my-menu.json'];
        const { menuPath, customActions } = parseArgs();
        expect(menuPath).toBe('my-menu.json');
        expect(customActions).toEqual([]);
    });

    test('should handle only custom actions', () => {
        process.argv = ['node', 'index.js', 'custom-action=a,b'];
        const { menuPath, customActions } = parseArgs();
        expect(menuPath).toBeNull();
        expect(customActions).toEqual(['a', 'b']);
    });

    test('should handle backward compatibility for menu path', () => {
        process.argv = ['node', 'index.js', 'my-menu.json'];
        const { menuPath, customActions } = parseArgs();
        expect(menuPath).toBe('my-menu.json');
        expect(customActions).toEqual([]);
    });

    test('should return null and empty array when no args are provided', () => {
        process.argv = ['node', 'index.js'];
        const { menuPath, customActions } = parseArgs();
        expect(menuPath).toBeNull();
        expect(customActions).toEqual([]);
    });
});
