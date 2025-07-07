import { convertToLiter } from './IVolume';
import { Volume } from '@smartcart/shared/src/volume';

describe('convertToLiter', () => {
  it('should convert 500 milliliters to 0.5 liters', () => {
    const input: Volume = { value: 500, unit: 'מ"ל' };
    const result = convertToLiter(input);
    expect(result).toEqual({ value: 0.5, unit: 'ליטר' });
  });

  it('should convert 2500 מיליליטר to 2.5 liters', () => {
    const input: Volume = { value: 2500, unit: 'מיליליטר' };
    const result = convertToLiter(input);
    expect(result).toEqual({ value: 2.5, unit: 'ליטר' });
  });

  it('should keep 3 liters as 3 liters', () => {
    const input: Volume = { value: 3, unit: 'ליטר' };
    const result = convertToLiter(input);
    expect(result).toEqual({ value: 3, unit: 'ליטר' });
  });

  it('should throw error for unsupported unit', () => {
    const badInput = { value: 1, unit: 'גלון' } as unknown as Volume;
    expect(() => convertToLiter(badInput)).toThrow('יחידת נפח לא נתמכת');
  });
});
