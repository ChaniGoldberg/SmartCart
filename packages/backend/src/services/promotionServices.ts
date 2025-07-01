import { IPromotions } from '../interfaces/Ipromotios';
import { mockDb } from '../mock/mockDB'; // Importing mockDb
import { IDB } from "../db/IDB"; // Import IDB if needed

export const promotionsService: IPromotions = {
  async promotionsBySuperId(storeName: string): Promise<IDB['Promotion']> { // Using IDB['Promotion']
    const today = new Date();

    try {
      const store = mockDb.Store.find(s => s.storeName === storeName); // Using mockDb

      if (!store) {
        throw new Error(`Store with name '${storeName}' not found`);
      }

      const promotions: IDB['Promotion'] = mockDb.Promotion
        .filter((promotion) => {
          const promotionStartDate = new Date(promotion.startDate);
          const promotionEndDate = new Date(promotion.endDate);

          return promotion.storeId === store.storeId &&
                 promotionStartDate <= today &&
                 promotionEndDate >= today;
        })
        .map((promotion) => ({
          ...promotion,
          startDate: new Date(promotion.startDate),
          endDate: new Date(promotion.endDate),
          lastUpdated: new Date(promotion.lastUpdated),
        }));

      return promotions;
    } catch (error) {
      console.error('Error fetching promotions:', error);
      throw new Error('Could not fetch promotions');
    }
  }
};


export default promotionsService;