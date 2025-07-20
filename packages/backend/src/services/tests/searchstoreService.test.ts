// packages/backend/src/services/tests/searchStoreService.test.ts

// --- Mocking ל-Supabase ---
jest.mock('../supabase', () => ({
  createClient: jest.fn((url, key) => {
    return {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
          data: [],
          error: null,
        })),
      })),
    };
  }),
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          data: [],
          error: null,
        })),
        data: [],
        error: null,
      })),
    })),
  },
}));

import { searchStoresService } from '../searchStoreService';
import { StoreRepository } from '../../db/Repositories/storeRepository';
import { Store } from '@smartcart/shared';

// --- אובייקטים מדומים של חנויות (Mock Stores) ---
const mockStores: Store[] = [
  {
    storePK: '1-1-101',
    storeId: 101,
    chainName: 'שופרסל',
    chainId: 1,
    subChainName: 'דיל',
    subChainId: 1,
    storeName: 'שופרסל דיל רמת אביב',
    address: 'שד. איינשטיין 40',
    city: 'תל אביב',
    zipCode: '6910101',
  },
  {
    storePK: '2-2-202',
    storeId: 202,
    chainName: 'רמי לוי',
    chainId: 2,
    subChainName: 'שיווק השקמה',
    subChainId: 2,
    storeName: 'רמי לוי שיווק השקמה מודיעין',
    address: 'שדרות התחבורה 1',
    city: 'מודיעין-מכבים-רעות',
    zipCode: '7170102',
  },
  {
    storePK: '1-3-103',
    storeId: 103,
    chainName: 'שופרסל',
    chainId: 1,
    subChainName: 'שלי',
    subChainId: 3,
    storeName: 'שופרסל שלי כרמליה',
    address: 'דרך הים 100',
    city: 'חיפה',
    zipCode: '3470103',
  },
  {
    storePK: '3-4-304',
    storeId: 304,
    chainName: 'מחסני השוק',
    chainId: 3,
    subChainName: 'שוק',
    subChainId: 4,
    storeName: 'מחסני השוק באר שבע',
    address: 'דרך חברון 50',
    city: 'באר שבע',
    zipCode: '8489404',
  },
];

// --- Mocking ל-StoreRepository ---
// שומרים הפניה ל-mock פונקציית getAllStores מחוץ ל-jest.mock
// כדי שנוכל לגשת אליה ישירות ב-beforeEach ו-afterEach.
const mockGetAllStores = jest.fn();

jest.mock('../../db/Repositories/storeRepository', () => {
  return {
    StoreRepository: jest.fn().mockImplementation(() => ({
      getAllStores: mockGetAllStores, // מקשרים את הפונקציה הממוקקת שלנו
    })),
  };
});

describe('searchStoresService', () => {

  beforeEach(() => {
    // מנקה את הקריאות הקודמות ל-mockGetAllStores
    mockGetAllStores.mockClear();
    // מגדיר את ערך ההחזרה ל-mockGetAllStores עבור כל בדיקה
    mockGetAllStores.mockResolvedValue(mockStores);
  });

  // אין צורך ב-afterEach כאן מכיוון ש-mockClear נעשה ב-beforeEach,
  // מה שמבטיח שכל בדיקה מתחילה עם מוק נקי.
  // אם היו מקרים בהם היינו צריכים לנקות משהו בסיום בדיקה ספציפית, אז כן.

  test('should return stores matching the search query (case-insensitive)', async () => {
    const result = await searchStoresService('שופרסל');
    expect(result).toHaveLength(2);
    expect(result[0].storeName).toContain('שופרסל');
    expect(result[1].storeName).toContain('שופרסל');
    // בודקים את הקריאה על המוק הישיר
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);
  });

  
  test('should return stores matching a partial search query', async () => {
    const result = await searchStoresService('לוי');
    expect(result).toHaveLength(1);
    expect(result[0].storeName).toContain('רמי לוי');
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);
  });

  test('should return an empty array if no stores match the query', async () => {
    const result = await searchStoresService('חנות לא קיימת');
    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);
  });

  test('should return all stores if the search query is an empty string', async () => {
    const result = await searchStoresService('');
    expect(result).toHaveLength(mockStores.length);
    expect(result).toEqual(mockStores);
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);
  });

  test('should return all stores if the search query is a space', async () => {
    const result = await searchStoresService(' ');
    expect(result).toHaveLength(mockStores.length);
    expect(result).toEqual(mockStores);
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);
  });

  test('should filter stores by name correctly regardless of case', async () => {
    const resultLowerCase = await searchStoresService('שופרסל');
    expect(resultLowerCase).toHaveLength(2);
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);

    // מכיוון ש-mockClear מתבצע ב-beforeEach,
    // הבדיקה הזו תרוץ אחרי ש-mockGetAllStores כבר נוקה והוגדר מחדש עבורה.
    // אם היית רוצה לבדוק ששתי הקריאות האלה קורות *בתוך אותו טסט* ומצטברות,
    // היית צריך לשנות את הלוגיקה של ה-beforeEach או לעשות mockClear ספציפי בנקודה זו.
    // כרגע, כל קריאה ל-searchStoresService בתוך בדיקה אמורה להוביל לקריאה אחת ל-getAllStores.
    // ולכן נצפה ל-toHaveBeenCalledTimes(1) גם כאן.
    mockGetAllStores.mockClear(); // ננקה כדי שהקריאה הבאה תהיה 1
    mockGetAllStores.mockResolvedValue(mockStores); // נחזיר את הערך הממוקק

    const resultUpperCase = await searchStoresService('שופרסל');
    expect(resultUpperCase).toHaveLength(2);
    expect(mockGetAllStores).toHaveBeenCalledTimes(1);


    expect(resultLowerCase).toEqual(resultUpperCase);
  });
});