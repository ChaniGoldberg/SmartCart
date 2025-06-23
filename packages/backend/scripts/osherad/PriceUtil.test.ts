import { getLatestPriceFilesPerStore } from './PriceUtils';

describe('getLatestPriceFilesPerStore', () => {
    it('should return only the latest PriceFull file per branch from URLs', () => {
        const urls = [
            'https://url.publishedprices.co.il/file/d/PriceFull7290103152017-001-202506120800.gz',
            'https://url.publishedprices.co.il/file/d/PriceFull7290103152017-001-202506120805.gz', // יותר חדש
            'https://url.publishedprices.co.il/file/d/PriceFull7290103152017-002-202506120700.gz',
            'https://url.publishedprices.co.il/file/d/PriceFull7290103152017-002-202506120710.gz', // יותר חדש
            'https://url.publishedprices.co.il/file/d/Store7290103152017-002-202506120710.gz', // לא PriceFull
            'https://url.publishedprices.co.il/file/d/PriceFull7290103152017-003-202406120710.gz'  // ישן מאוד
        ];

        const result = getLatestPriceFilesPerStore(urls);

        expect(result).toContain('PriceFull7290103152017-001-202506120805.gz');
        expect(result).toContain('PriceFull7290103152017-002-202506120710.gz');
        expect(result).toContain('PriceFull7290103152017-003-202406120710.gz');
        expect(result.length).toBe(3);
    });

    it('should return an empty array if no PriceFull files exist', () => {
        const urls = [
            'https://url.publishedprices.co.il/file/d/Store7290103152017-001-202506120800.gz',
            'https://url.publishedprices.co.il/file/d/PromoFull7290103152017-001-202506120800.gz'
        ];

        const result = getLatestPriceFilesPerStore(urls);
        expect(result).toEqual([]);
    });
});
