import getMostUpdate from '../getMostUpdate';

describe('getMostUpdate', () => {

    test('should handle multiple branches correctly', () => {
        let result = getMostUpdate(["PriceFull7290058140886-001-202506110110.xml","PriceFull7290058140886-001-202505110110.xml","Price7290058140886-001-202506110110.xml"],'001');
        expect(result).toBe("PriceFull7290058140886-001-202506110110.xml");
    });

        test('if input invalid branch', () => {
        let result = getMostUpdate(["PriceFull7290058140886-001-202506110110.xml"],'034');
        expect(result).toBe(null);
    });
});

