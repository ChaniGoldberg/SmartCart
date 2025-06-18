
import { getMostUpdatePromoFile } from '../promotions-netiv-hachesed';

describe('getMostUpdatePromoFile', () => {

  it('should return null when no promo files are provided', () => {
    expect(getMostUpdatePromoFile([], '123')).toBeNull();
  });

  it('should return null if no valid promo files are found', () => {
    const filesNames = ['InvalidFile1', 'InvalidFile2'];
    expect(getMostUpdatePromoFile(filesNames, '123')).toBeNull();
  });
  it('should return null if no promo files match the branch number', () => {
        const filesNames = [
            'PromoFull123-001-202310010000',
            'PromoFull123-001-202310020000',
            'PromoFull123-001-202310030000'
        ];
        expect(getMostUpdatePromoFile(filesNames, '999')).toBeNull();
    });

  it('returns null if the array is empty', () => {
    const filesNames: string[] = [];
    const branch = "001";
    const result = getMostUpdatePromoFile(filesNames, branch);
    expect(result).toBeNull();
  });

  it('checks case of multiple strings with the same dates', () => {
    const filesNames = [
      'PromoFull123-001-202310010000',
      'PromoFull456-001-202310010000',
      'PromoFull123-001-202310010000'
    ];
    const branch = "001";
    const result = getMostUpdatePromoFile(filesNames, branch);
    expect(result).toBe("PromoFull456-001-202310010000");
  });
});