import { Request, Response } from "express";
import { findStoresWithinRadius } from "../../utils/findStoresWithinRadius";

interface UserLocation {
    latitude: number | null;
    longitude: number | null;
    error: string | null;
    loading: boolean;
}
export const getStoresWithinRadiusController = async (req: Request, res: Response) => {
    try {
        const { latitude, longitude, radius } = req.params;

        if (!latitude || !longitude || !radius) {
            return res.status(400).json({ error: "חסרים פרמטרים: latitude, longitude, או radius" });
        }

        // // המרה למספרים ואימות
        const lat = parseFloat(latitude as string);
        const lon = parseFloat(longitude as string);
        const rad = parseFloat(radius as string);

        if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
            return res.status(400).json({ error: "פרמטרים לא חוקיים: latitude, longitude, או radius אינם מספרים" });
        }

        const locationForUtil: UserLocation = {
            latitude: lat,
            longitude: lon,
            error: null,
            loading: false,
        };
        const stores = await findStoresWithinRadius(locationForUtil, rad);

        return res.status(200).json(stores);

    } catch (error) {
        console.error("שגיאה באיתור חנויות:", error);
        return res.status(500).json({ error: "שגיאת שרת פנימית" });
    }
};