import * as updateDailyDataModule from '../updateDailyData';

// Mock dependencies
jest.mock('../parseXmlToJson', () => ({
  convertStoreXmlToStoreJson: jest.fn().mockResolvedValue([
    { storeId: 1, subChainId: 10, chainId: 1, chainName: 'A', subChainName: 'B', storeName: 'C', address: 'D', city: '', zipCode: '' }
  ])
}));
jest.mock('../parseXmlFullPrice', () => ({
  convertXMLPriceFullStringToFilteredJson: jest.fn().mockResolvedValue([
    { itemCode: 1, itemType: 1, itemName: 'item', manufacturerName: '', manufactureCountry: '', manufacturerItemDescription: '', itemStatus: true, itemId: 1, tagsId: [], correctItemName: '' }
  ])
}));
jest.mock('../parseXMLPromosFullToJson', () => ({
  convertXMLPromotionStringToFilteredJson: jest.fn().mockResolvedValue([
    { promotionId: 1, storeId: 1, promotionDescription: 'promo', startDate: new Date(), endDate: new Date(), lastUpdated: new Date(), isActive: true, discountedPrice: 10, promotionItemsCode: [1], minQuantity: 1, maxQuantity: 1, requiresCoupon: false, requiresClubMembership: false, clubId: 0, minNumberOfItemOfered: 1, remarks: '' }
  ])
}));
jest.mock('../promotions-netiv-hachesed', () => ({
  getMostUpdatePromoFile: jest.fn().mockReturnValue('promo.xml')
}));
jest.mock('../latestPrices', () => ({
  getLatestUpdatePriceFullFile: jest.fn().mockReturnValue('price.xml')
}));

// Mock global.fetch
global.fetch = jest.fn(async (url: string) => ({
  ok: true,
  text: async () => url.endsWith('.xml') ? '<xml></xml>' : `
    <html>
      <body>
        <a href="stores.xml">stores.xml</a>
        <a href="promo.xml">promo.xml</a>
        <a href="price.xml">price.xml</a>
      </body>
    </html>
  `
})) as any;

describe('updateDailyData', () => {
  it('should run without throwing and log summary', async () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(updateDailyDataModule.updateDailyData()).resolves.not.toThrow();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining("עדכון נתונים יומי עבור נתיב החסד הושלם בהצלחה!"));
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });
});