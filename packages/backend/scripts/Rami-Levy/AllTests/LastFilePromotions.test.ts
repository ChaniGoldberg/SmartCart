// ייבוא הפונקציה שברצוננו לבדוק
import { ReturnsTheMostUpToDatePromotionsFile } from '../LastFilePromotions'; // ודא שהנתיב נכון

describe('ReturnsTheMostUpToDatePromotionsFile', () => {

  // מקרה בדיקה 1: מציאת הקובץ העדכני ביותר עבור סניף קיים
  test('should return the latest file for a given store ID', async () => {
    const allFiles = [
      'PromoFull-123-20231025.xml',
      'PromoFull-123-20231026.xml',
      'PromoFull-456-20231027.xml',
      'PromoFull-123-20231027.xml',
      'OtherFile-789-20231101.xml', // קובץ שאינו מתחיל ב-PromoFull
      'PromoFull-123-20231020.xml', // קובץ ישן יותר
    ];
    const storeId = '123';
    const expectedFile = 'PromoFull-123-20231027.xml'; // הקובץ העדכני ביותר עבור סניף 123

    const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
    expect(result).toBe(expectedFile);
  });

  // מקרה בדיקה 2: מציאת הקובץ העדכני ביותר כאשר יש רק קובץ אחד לסניף
  test('should return the file when only one matching file exists', async () => {
    const allFiles = [
      'PromoFull-999-20240101.xml',
      'PromoFull-111-20230501.xml',
    ];
    const storeId = '999';
    const expectedFile = 'PromoFull-999-20240101.xml';

    const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
    expect(result).toBe(expectedFile);
  });

  // מקרה בדיקה 3: החזרת null כאשר אין קבצים התואמים לקוד הסניף
  test('should return null if no matching file for the store ID is found', async () => {
    const allFiles = [
      'PromoFull-123-20231025.xml',
      'PromoFull-456-20231027.xml',
    ];
    const storeId = '777'; // קוד סניף שאינו קיים ברשימה

    const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
    expect(result).toBeNull();
  });

  // מקרה בדיקה 4: החזרת null כאשר רשימת הקבצים ריקה
  test('should return null if the file list is empty', async () => {
    const allFiles: string[] = [];
    const storeId = '123';

    const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
    expect(result).toBeNull();
  });

  // מקרה בדיקה 5: התעלמות מקבצים שאינם מתחילים ב-'PromoFull'
  test('should ignore files not starting with "PromoFull"', async () => {
    const allFiles = [
      'SomeOtherFile-123-20240101.xml',
      'PromoFull-123-20231231.xml',
    ];
    const storeId = '123';
    const expectedFile = 'PromoFull-123-20231231.xml';

    const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
    expect(result).toBe(expectedFile);
  });

  // מקרה בדיקה 6: בדיקה של מיון נכון כאשר יש קבצים עם אותו תאריך אך מזהים שונים
  test('should correctly sort and find the latest among files with same date but different IDs', async () => {
    const allFiles = [
      'PromoFull-123-20240101.xml',
      'PromoFull-456-20240101.xml',
      'PromoFull-123-20231231.xml',
    ];
    const storeId = '123';
    const expectedFile = 'PromoFull-123-20240101.xml';

    const result = await ReturnsTheMostUpToDatePromotionsFile(allFiles, storeId);
    expect(result).toBe(expectedFile);
  });
});