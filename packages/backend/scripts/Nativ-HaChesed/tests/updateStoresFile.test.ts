import { lastUpdateStores } from '../updateStoresFile';

describe.only('LastUpdateStores', () => {
    it('should return the last update stores file', () => {
        const files = ['Price7290058160839-006-202506181125', 'PromoFull7290058160839-229-202506180546', 'StoresFull7290058160839-000-202506180531','StoresFull7290058160839-000-202505180531'];
        const result = lastUpdateStores(files);
        expect(result).toBe('StoresFull7290058160839-000-202506180531');
    });
    it('should return undefined for empty array', () => {
        const result = lastUpdateStores([]);
        expect(result).toBeUndefined();
    });
    it('should return undefined if no StoresFull file is present', () => {
        const files = ['Price7290058160839-006-202506181125', 'PromoFull7290058160839-229-202506180546'];
        const result = lastUpdateStores(files);
        expect(result).toBeUndefined();
    });
})

