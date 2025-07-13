import { Request, Response } from "express";
import { searchStoresService } from "../services/searchStoreService"; 

/**
 * @swagger
 * /search/stores:
 *   get:
 *     summary: חיפוש סופר לפי שם
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         description: שם הסופר לחיפוש
 *         type: string
 *     responses:
 *       200:
 *         description: הצלחה
 *       400:
 *         description: שם הסופר נדרש
 *       500:
 *         description: שגיאה בשרת
 */
export const searchStoreController = async (req: Request, res: Response) => {
    const { name } = req.query;

    if (typeof name !== 'string' || name.trim() === ''){
        return res.status(400).json({ error: "שם הסופר נדרש" });
    }

    try {
        const stores = await searchStoresService(name);
        res.status(200).json({
            success: true,
            message: `The search by store name ${name} is successfully!`,
            stores
        });
    } catch (error) {
        console.error('Error searching for stores:', error);
        res.status(500).json({ error: "שגיאה בשרת" });
    }
};
