// import { IPromotions } from "../interfaces/Ipromotions";
// import { db } from "../db/dbProvider"; // שימוש ב-db הכללי עם שם קובץ מתוקן

// export const promotionsService: IPromotions = {
//     async getPromotionsByStorePK(storePK: string): Promise<typeof db.Promotion> {
//         if (!storePK || typeof storePK !== "string") {
//             throw { status: 400, message: "Invalid or missing storePK" };
//         }

//         const today = new Date();

//         const promotions = db.Promotion.filter((promotion) => {
//             const start = new Date(promotion.startDate);
//             const end = new Date(promotion.endDate);

//             return (
//                 promotion.storePK === storePK &&
//                 start <= today &&
//                 end >= today
//             );
//         }).map((promotion) => ({
//             ...promotion,
//             startDate: new Date(promotion.startDate),
//             endDate: new Date(promotion.endDate),
//             lastUpdated: new Date(promotion.lastUpdated),
//         }));

//         return promotions;
//     },
// };

// export default promotionsService;



import { IPromotions } from "../interfaces/Ipromotions";
import { supabase } from "../services/supabase"; // נשאר כמו שהוא

export const promotionsService: IPromotions = {
    async getPromotionsByStoreId(storePK: string): Promise<typeof db.Promotion> {
        if (!storePK || typeof storePK !== "string") {
            throw { status: 400, message: "Invalid or missing storeId" };
        }

    const today = new Date().toISOString();
    const { data, error } = await supabase
      .from("promotion")
      .select("*")
      .eq("store_pk", storePK) // שימוש ישיר במחרוזת
      .lte("start_date", today)
      .gte("end_date", today);

    if (error) {
      console.error("Supabase error:", error.message);
      throw { status: 500, message: "Failed to fetch promotions" };
    }

    return data || [];
  },
};

export default promotionsService;