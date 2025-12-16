// Important: We need to reset the flatMap between tests.
// Jest can't easily reset modules, so we'll handle it manually.
let menu = require('../src/menu');

describe('menu', () => {

    beforeEach(() => {
        // Reset the flatMap object before each test
        for (const key in menu.flatMap) {
            delete menu.flatMap[key];
        }
    });
    
    test('buildIdMap should correctly flatten a simple menu', () => {
        const options = [
            { id: '1', name: 'Action 1' },
            { id: '2', name: 'Action 2' },
        ];
        menu.buildIdMap(options);
        expect(menu.flatMap).toEqual({
            '1': { id: '1', name: 'Action 1' },
            '2': { id: '2', name: 'Action 2' },
        });
    });

    test('buildIdMap should correctly flatten a nested menu', () => {
        const options = [
            { id: '1', name: 'Nav 1', options: [
                { id: '1.1', name: 'Action 1.1' },
            ]},
            { id: '2', name: 'Action 2' },
        ];
        menu.buildIdMap(options);
        expect(Object.keys(menu.flatMap).length).toBe(3);
        expect(menu.flatMap['1.1']).toEqual({ id: '1.1', name: 'Action 1.1' });
    });

    test('buildIdMap should handle an empty options array', () => {
        const options = [];
        menu.buildIdMap(options);
        expect(menu.flatMap).toEqual({});
    });
});
