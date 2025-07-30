import { Store } from "@smartcart/shared/src/store";
import { StoreLocationDto } from "@smartcart/shared";
import { StoreRepository } from '../db/Repositories/storeRepository';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// זיכרון זמני לכתובות
const addressCache = new Map<string, { lat: number; lng: number } | null>();
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

// חשוב: StoreRepository חייב להיות מוגדר כאן כדי שפונקציות השירות יוכלו להשתמש בו.
const storeRepository = new StoreRepository(supabase);

// פונקציה להמרת כתובת לקואורדינטות
export const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number } | null> => {
    if (!OPENCAGE_API_KEY) {
        throw new Error("OPENCAGE_API_KEY is not defined. Please set it in your environment.");
    }
    if (addressCache.has(address)) {
        return addressCache.get(address)!;
    }
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&language=he&limit=1`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Geocoding API returned status ${response.status}`);
        }
        const data: any = await response.json();
        if (data && data.results && data.results.length > 0) {
            const lat = data.results[0].geometry.lat;
            const lng = data.results[0].geometry.lng;
            if (typeof lat === 'number' && typeof lng === 'number'
                && lat >= -90 && lat <= 90
                && lng >= -180 && lng <= 180) {
                const result = { lat, lng };
                addressCache.set(address, result);
                return result;
            } else {
                console.log("קואורדינטות לא תקינות:", lat, lng);
                return null;
            }
        }
        return null;
    } catch (error) {
        console.error('שגיאה בהמרת כתובת:', error);
        return null;
    }
};

// מנגנון Limit לניהול concurrency
export async function limitConcurrency<T, R>(
    items: T[],
    handler: (item: T) => Promise<R>,
    limit: number
): Promise<R[]> {
    const results: R[] = [];
    let index = 0;

    const workers = Array.from({ length: limit }, async () => {
        while (index < items.length) {
            const currentIndex = index++;
            results[currentIndex] = await handler(items[currentIndex]);
        }
    });

    await Promise.all(workers);
    return results;
}

// --- פונקציה קיימת (משודרגת) לטעינת חנויות תקינות (כולל קואורדינטות) ---
export const getStoresWithCoordinates = async (): Promise<StoreLocationDto[]> => {
    try {
        // קבל את כל החנויות מהמאגר, כולל אלה שעדיין ללא קואורדינטות
        const stores: Store[] = await storeRepository.getAllStores();

        // סנן רק חנויות שיש להן קואורדינטות תקינות
        const filtered = stores
            .filter(s => typeof s.latitude === 'number' && typeof s.longitude === 'number')
            .map(s => {
                // *** השינוי המרכזי כאן ***
                let displayStoreName = s.chainName || ''; // התחל עם שם הרשת (אם קיים)

                // הוסף את storeName אם הוא קיים ושונה מ-chainName (או אם chainName לא קיים)
                // שימי לב: בהנחה ש-s.storeName מתייחס לעמודה 'sub_chain_name' ב-DB שלך
                // או כל עמודה אחרת שמכילה את שם הסניף הספציפי.
                if (s.storeName && s.storeName !== s.chainName) {
                    displayStoreName += ` ${s.storeName}`;
                }

                // הוסף את הכתובת (עיר ורחוב) אם קיימת
                const fullAddress = `${s.city || ''}${s.address ? `, ${s.address}` : ''}`.trim();
                if (fullAddress) {
                    displayStoreName += ` (${fullAddress})`;
                }

                // אם displayStoreName עדיין ריק מסיבה כלשהי, השתמשי בכתובת המלאה כגיבוי
                if (!displayStoreName) {
                    displayStoreName = `${s.address || ''}, ${s.city || ''}`.trim();
                }
                // סתם ליתר בטחון אם נשאר ריק לגמרי
                 if (!displayStoreName && s.storePK) {
                    displayStoreName = `חנות עם קוד: ${s.storePK}`;
                }


                return new StoreLocationDto(
                    s.storePK,
                    s.chainId,
                    s.chainName,
                    displayStoreName, // <--- השדה שיוצג ב-dropdown ב-frontend
                    `${s.address || ''}, ${s.city || ''}`.trim(), // בניית הכתובת המלאה לשדה ה-address ב-DTO
                    s.latitude!,
                    s.longitude!
                );
            });

        console.log(`✅ נטענו ${filtered.length} חנויות עם קואורדינטות`);
        return filtered;
    } catch (error) {
        console.error('❌ שגיאה בשליפת חנויות עם קואורדינטות:', error);
        throw error;
    }
};