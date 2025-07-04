import { getPriceByStoreIDItemID } from '../cartService';
import { Price } from '@smartcart/shared/src/price';

// דוגמת מערך מחירים
const mockPrices: Price[] = [
  { priceId: 1, storeId: 1, itemId: 10, itemCode: 100, price: 5, priceUpdateDate: new Date(), unitQuantity: "1", quantity: 10, unitOfMeasure: "יחידה", isWeighted: false, quantityInPackage: "1", unitOfMeasurePrice: 5, allowDiscount: true },
  { priceId: 2, storeId: 2, itemId: 20, itemCode: 200, price: 10, priceUpdateDate: new Date(), unitQuantity: "1", quantity: 20, unitOfMeasure: "יחידה", isWeighted: false, quantityInPackage: "1", unitOfMeasurePrice: 10, allowDiscount: true }
];

// mock ל-db
jest.mock('../db/dbProvider', () => ({
  db: { Price: mockPrices }
}));

describe('getPriceByStoreIDItemID', () => {
  it('should return the correct price when found', async () => {
    const result = await getPriceByStoreIDItemID(1, 10);
    expect(result).toBeDefined();
    expect(result?.price).toBe(5);
  });

  it('should return null when not found', async () => {
    const result = await getPriceByStoreIDItemID(99, 99);
    expect(result).toBeNull();
  });
});