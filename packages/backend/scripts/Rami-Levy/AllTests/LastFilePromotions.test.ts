import { ReturnsTheMostUpToDatePromotionsFile } from '../LastFilePromotions'; // וודא שזה הנתיב הנכון

describe('lastFileForStoreId', () => { // שם ה-describe

    it('should return the latest date for the given storeId', async () => {
        const allFiles = [
            'PromoFull-123-20231025.xml', // חזרנו ל-PromoFull
            'PromoFull-123-20231026.xml',
            'PromoFull-456-20231027.xml', // קובץ של סניף אחר
            'PromoFull-123-20231027.xml', // זה אמור להיות התאריך האחרון
        ];
        const storeId = '123';
        const expectedDate = '20231027'; // מצפים לסטרינג בודד
        const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
        expect(result).toBe(expectedDate); // שימוש ב-toBe
    });

    it('should return undefined if no files match the storeId', async () => {
        const allFiles = [
            'PromoFull-456-20231025.xml',
            'PromoFull-456-20231026.xml',
        ];
        const storeId = '123'; // לא אמור למצוא קבצים עבור storeId זה
        const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
        expect(result).toBeUndefined(); // מצפים ל-undefined
    });

    it('should return undefined if no files start with "PromoFull"', async () => {
        const allFiles = [
            'SomeOtherFile-123-20231025.xml', // לא מתחיל ב-PromoFull
            'AnotherFile-123-20231026.xml', // לא מתחיל ב-PromoFull
        ];
        const storeId = '123';
        const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
        expect(result).toBeUndefined(); // מצפים ל-undefined
    });

    it('should handle empty input list', async () => {
        const allFiles: string[] = [];
        const storeId = 'anyStoreId';
        const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
        expect(result).toBeUndefined(); // מצפים ל-undefined
    });

    it('should return the only matching date if there is one file', async () => {
        const allFiles = [
            'PromoFull-123-20240101.xml', // הקובץ היחיד התואם
            'PromoFull-456-20230101.xml', // קובץ של סניף אחר
        ];
        const storeId = '123';
        const expectedDate = '20240101';
        const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
        expect(result).toBe(expectedDate);
    });

});


