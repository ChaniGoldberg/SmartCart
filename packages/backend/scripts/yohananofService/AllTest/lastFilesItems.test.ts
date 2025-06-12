import { lastFileForStoreId } from '../lastFilesItem';
describe('lastFilePromotionForStoreId', () => {
    it('should return a sorted array of dates for a given storeId', async () => {
        const allFiles = [
            'PromoFull-060-20231026',
            'PromoFull-060-20231027',
            'PromoFull-070-20231025',
            'PromoFull-060-20231025',
        ];
        const storeId = '060';
        const expectedDates = ['20231025', '20231026', '20231027'];
        const result = await lastFileForStoreId(allFiles, storeId);
        expect(result).toEqual(expectedDates);
    });
    it('should return an empty array if no files match the storeId', async () => {
        const allFiles = [
            'PromoFull-070-20231025',
            'PromoFull-070-20231026',
        ];
        const storeId = '060';
        const expectedDates: string[] = [];
        const result = await lastFileForStoreId(allFiles, storeId);
        expect(result).toEqual(expectedDates);
    });
    it('should return an empty array if no files start with "PromoFull"', async () => {
        const allFiles = [
            'SomeOtherFile-060-20231025',
            'PromoFull-070-20231026',
        ];
        const storeId = '060';
        const expectedDates: string[] = [];
        const result = await lastFileForStoreId(allFiles, storeId);
        expect(result).toEqual(expectedDates);
    });
    it('should handle files with different date formats', async () => {
        const allFiles = [
            'PromoFull-060-20231026',
            'PromoFull-060-20231027',
            'PromoFull-070-20231025',
            'PromoFull-060-20231025',
            'PromoFull-060-2023-10-28',
        ];
        const storeId = '060';
        const expectedDates = ['20231025', '20231026', '20231027'];
        const result = await lastFileForStoreId(allFiles, storeId);
        expect(result).toEqual(expectedDates);
    });
});
