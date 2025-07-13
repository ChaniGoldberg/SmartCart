import { StoreRepository } from "../db/Repositories/storeRepository";
import { getValidStores,addStoreService } from "../services/storeService";
import { Request, Response } from "express";

/**
 * @swagger
 * /stores/stores:
 *   get:
 *     summary: שליפת רשימת סניפים עם קואורדינטות
 *     responses:
 *       200:
 *         description: הצלחה
 *       500:
 *         description: שגיאה בשרת
 */


export const storeController = async (req: Request, res: Response) => {
    try{
const coordinates= await getValidStores();//מחכה לתוצאה של הפונקציה getValidStores
res.status(200).json(coordinates);
    }
    catch(error){
        console.error('Error fetching valid stores:', error);
        res.status(500).json({ error: "שגיאה בשרת" });
    }
}

