import { IPromotions } from "../interfaces/Ipromotions";
import { db } from "../db/dbProvider"; // שימוש ב-db הכללי עם שם קובץ מתוקן

export const promotionsService: IPromotions = {
    async getPromotionsByStoreId(storePK: string): Promise<typeof db.Promotion> {
        if (!storePK || typeof storePK !== "number") {
            throw { status: 400, message: "Invalid or missing storeId" };
        }

        const today = new Date();

        const promotions = db.Promotion.filter((promotion) => {
            const start = new Date(promotion.startDate);
            const end = new Date(promotion.endDate);

            return (
                promotion.storePK === storePK &&
                start <= today &&
                end >= today
            );
        }).map((promotion) => ({
            ...promotion,
            startDate: new Date(promotion.startDate),
            endDate: new Date(promotion.endDate),
            lastUpdated: new Date(promotion.lastUpdated),
        }));

        return promotions;
    },
};

export default promotionsService;
