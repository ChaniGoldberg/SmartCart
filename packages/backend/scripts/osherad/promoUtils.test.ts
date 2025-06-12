import { getLatestPromoFilesPerStore } from './promoUtils';

describe('getLatestPromoFilesPerStore', () => {
    it('should return only the latest PromoFull file per store', () => {
        const files = [
            'PromoFull7290103152017-001-202506120800',
            'PromoFull7290103152017-001-202506120805', // יותר חדש
            'PromoFull7290103152017-002-202506120700',
            'PromoFull7290103152017-002-202506120710', // יותר חדש
            'Store7290103152017-002-202506120710', // לא PromoFull
            'PromoFull7290103152017-003-202406120710'  // ישן מאוד
        ];

        const result = getLatestPromoFilesPerStore(files);

        expect(result).toContain('PromoFull7290103152017-001-202506120805');
        expect(result).toContain('PromoFull7290103152017-002-202506120710');
        expect(result).toContain('PromoFull7290103152017-003-202406120710');
        expect(result.length).toBe(3);
    });

    it('should return an empty array if no PromoFull files exist', () => {
        const files = [
            'Store7290103152017-001-202506120800',
            'PriceFull7290103152017-001-202506120800'
        ];

        const result = getLatestPromoFilesPerStore(files);
        expect(result).toEqual([]);
    });

    it('should handle empty input', () => {
        const result = getLatestPromoFilesPerStore([]);
        expect(result).toEqual([]);
    });
});
