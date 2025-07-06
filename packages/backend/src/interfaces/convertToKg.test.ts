import { convertToKg } from './IWeight';
import { weight } from '@smartcart/shared/src/weight';

describe('convertToKg - דוגמאות המרה אמיתיות', () => {
  it('המרת קופסת גבינה 250 גרם', () => {
    const input: weight = { value: 250, unit: 'גרם' };
    const result = convertToKg(input);
    expect(result).toEqual({ value: 0.25, unit: 'ק"ג' });
  });

  it('המרת שקית אורז 1 ק"ג', () => {
    const input: weight = { value: 1, unit: 'ק"ג' };
    const result = convertToKg(input);
    expect(result).toEqual({ value: 1, unit: 'ק"ג' });
  });

  it('המרת קופסה של קמח 2 קילוגרמים', () => {
    const input: weight = { value: 2, unit: 'קילוגרמים' };
    const result = convertToKg(input);
    expect(result).toEqual({ value: 2, unit: 'ק"ג' });
  });

  it('המרת חפיסת שוקולד 100 גרמים', () => {
    const input: weight = { value: 100, unit: 'גרמים' };
    const result = convertToKg(input);
    expect(result).toEqual({ value: 0.1, unit: 'ק"ג' });
  });

  
});
