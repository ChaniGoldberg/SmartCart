import { getUpdatedPromotionForAllStores } from '../getUpdatedPromotionForAllStores';

describe('getUpdatedPromotionForAllStores', () => {
    it('should return the latest promotion file for each store, sorted by filename', async () => {
        const allFiles = [
            'PromoFull-060-20231026.pdf',
            'PromoFull-060-20231027.docx',
            'PromoFull-070-20231025.txt',
            'PromoFull-060-20231025.zip',
            'PromoFull-080-20231101.jpg',
            'PromoFull-070-20231020.pdf',
        ];

        const expectedFileNames = [
            'PromoFull-060-20231027.docx',
            'PromoFull-070-20231025.txt',
            'PromoFull-080-20231101.jpg',
        ];

        const result = await getUpdatedPromotionForAllStores(allFiles);

        expect(result).toEqual(expectedFileNames);
    });

    it('should return an empty array if no "PromoFull" files are present', async () => {
        const allFiles = [
            'SomeOtherFile-060-20231025.txt',
            'AnotherDoc-070-20231026.pdf',
        ];
        const expectedFileNames: string[] = [];

        const result = await getUpdatedPromotionForAllStores(allFiles);

        expect(result).toEqual(expectedFileNames);
    });

    it('should return the correct latest files when multiple files exist for the same store on different dates', async () => {
        const allFiles = [
            'PromoFull-111-20240101.pdf',
            'PromoFull-222-20240105.jpg',
            'PromoFull-111-20240110.docx',
            'PromoFull-333-20240102.txt',
            'PromoFull-222-20240103.png',
        ];
        const expectedFileNames = [
            'PromoFull-111-20240110.docx',
            'PromoFull-222-20240105.jpg',
            'PromoFull-333-20240102.txt',
        ];

        const result = await getUpdatedPromotionForAllStores(allFiles);

        expect(result).toEqual(expectedFileNames);
    });

    it('should handle files with incorrect naming conventions (e.g., missing parts or wrong date format)', async () => {
        const allFiles = [
            'PromoFull-060-20231026.pdf',
            'PromoFull-060-2023-10-27.docx',
            'PromoFull-070-20231025.txt',
            'PromoFull-060.zip',
            'PromoFull-080-20231101_v2.jpg',
        ];

        const expectedFileNames = [
            'PromoFull-060-20231026.pdf',
            'PromoFull-070-20231025.txt',
        ];

        const result = await getUpdatedPromotionForAllStores(allFiles);

        expect(result).toEqual(expectedFileNames);
    });
});