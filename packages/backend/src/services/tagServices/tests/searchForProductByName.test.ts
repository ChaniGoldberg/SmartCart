import ItemService from '../../itemService';
import { Item } from '@smartcart/shared/src/item';
import { SearchForProductByName } from '../searchForProductByName';



// Mock data
const mockItems: Item[] = [
  {
    itemCode: 1,
    itemId: 101,
    itemType: 1,
    itemName: 'חלב 3% תנובה',
    correctItemName: 'חלב תנובה 3 אחוז',
    manufacturerName: 'תנובה',
    manufactureCountry: 'ישראל',
    manufacturerItemDescription: 'חלב טרי 3% שומן של תנובה',
    itemStatus: true,
    tagsId: [1, 2],
  },
  {
    itemCode: 2,
    itemId: 102,
    itemType: 1,
    itemName: 'לחם אחיד קל',
    correctItemName: 'לחם אנגל קל',
    manufacturerName: 'אנגל',
    manufactureCountry: 'ישראל',
    manufacturerItemDescription: 'לחם פרוס קל של אנגל',
    itemStatus: true,
    tagsId: [3],
  },
  {
    itemCode: 3,
    itemId: 103,
    itemType: 1,
    itemName: 'מעדן שוקולד דנונה',
    correctItemName: 'דנונה מעדן שוקולד',
    manufacturerName: 'שטראוס',
    manufactureCountry: 'ישראל',
    manufacturerItemDescription: 'מעדן חלב בטעם שוקולד של שטראוס',
    itemStatus: true,
    tagsId: [4, 5],
  },
  {
    itemCode: 4,
    itemId: 104,
    itemType: 2,
    itemName: 'קמח לבן אסם',
    correctItemName: 'קמח אסם לבן',
    manufacturerName: 'אסם',
    manufactureCountry: 'ישראל',
    manufacturerItemDescription: 'קמח חיטה לבן מנופה של אסם',
    itemStatus: true,
    tagsId: [6],
  },
];

jest.mock('../itemService', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => {
      return {
        getAllItem: jest.fn().mockResolvedValue(mockItems),
      };
    }),
  };
});


describe('SearchForProductByName', () => {
  let itemService: ItemService;

  beforeEach(() => {
    itemService = new ItemService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return items matching the name in manufacturerItemDescription', async () => {
    const result = await SearchForProductByName('קל');
    expect(result).toHaveLength(1);
    expect(result[0].manufacturerItemDescription).toContain('קל');
  });

  test('should return items matching in either itemName or manufacturerItemDescription', async () => {
    const result = await SearchForProductByName('שוקולד');
    expect(result).toHaveLength(1);
    expect(result[0].itemName).toContain('שוקולד');
  });

  test('should return an empty array if no items match', async () => {
    const result = await SearchForProductByName('במבה');
    expect(result).toHaveLength(0);
  });


  test('should handle partial matches correctly', async () => {
    const result = await SearchForProductByName('דנו');
    expect(result).toHaveLength(1);
    expect(result[0].itemName).toContain('דנונה');
  });


});