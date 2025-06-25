import getLatestFile from "../Rami-Levi/getLatestFile";

describe('getLatestFile', () => {
    test('Was the array of objects received properly? Returns a good answer.', () => {
        let result = getLatestFile(["Stores7290058140886-000-20250622-050500.xml","Stores7290058140886-000-20250623-050500.xml","Stores7290058140886-000-20250624-050500.xml"]);
        expect(result).toBe("Stores7290058140886-000-20250624-050500.xml");
    });
        test('if the array of objects is empty', () => {
        let result = getLatestFile([]);
        expect(result).toBe(null);
    });
        test('if input invalid file', () => {
        let result = getLatestFile(["PriceFull7290058140886-001-202506110110.xml"]);
        expect(result).toBe(null);
    });
});