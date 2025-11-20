/**
 * Simple sanity test to verify Jest is working
 */
describe('Jest Setup', () => {
    test('should pass basic test', () => {
        expect(true).toBe(true);
    });

    test('should perform basic arithmetic', () => {
        expect(2 + 2).toBe(4);
    });
});
