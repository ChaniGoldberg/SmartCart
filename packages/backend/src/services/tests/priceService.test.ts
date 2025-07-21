import { IPriceRepository } from '../../db/IRepositories/IPriceRepository';
import { Price } from '@smartcart/shared/src/price';
import PriceService from '../priceService';

describe('PriceService', () => {
  let service: PriceService;
  let mockPriceRepository: jest.Mocked<IPriceRepository>;

  beforeEach(() => {
    mockPriceRepository = {
      getAllPrices: jest.fn(),
      addPrice: jest.fn(),
      addManyPrices: jest.fn(),
      updatePrice: jest.fn(),
      updateManyPrices: jest.fn(),
      getPriceById: jest.fn(),
      deletePriceById: jest.fn(),
    };

    service = new PriceService(mockPriceRepository);
  });

  it('should return all prices from the repository', async () => {
    const mockPrices: Price[] = [
      {
        priceId: 1,
        storePK: "1",
        itemCode: 100,
        itemId: 200,
        price: 9.99,
        priceUpdateDate: new Date(),
        unitQuantity: "1",
        quantity: 1,
        unitOfMeasure: "unit",
        isWeighted: false,
        quantityInPackage: 1,
        unitOfMeasurePrice: 9.99,
        allowDiscount: true,
      },
    ];

    mockPriceRepository.getAllPrices.mockResolvedValue(mockPrices);

    const result = await service.getAllPrices();

    expect(result).toEqual(mockPrices);
    expect(mockPriceRepository.getAllPrices).toHaveBeenCalledTimes(1);
  });
});
