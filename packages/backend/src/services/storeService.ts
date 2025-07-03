import { Store } from "@smartcart/shared/src/store";
import { db } from "../db/dbProvider";


//זכרון זמני לכתובות
const addressCache = new Map<string, { lat: number; lng: number } | null>();
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;//מפתח ה־API של OpenCage

// פונקציה להמרת כתובת לקואורדינטות
//באמצעות שימוש ב- penCage API,
//הפונקציה מקבלת כתובת ומחזירה את הקואורדינטות שלה
export const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number } | null> => {
  if (!OPENCAGE_API_KEY) {
  throw new Error("OPENCAGE_API_KEY is not defined. Please set it in your environment.");
}
  // בדיקה אם הכתובת כבר בזיכרון
  if (addressCache.has(address)) {
    return addressCache.get(address)!;
  }
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${OPENCAGE_API_KEY}&language=he&limit=1`;

try {
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error(`Geocoding API returned status ${response.status}`);
    }
    const data:any = await response.json();
//בדיקה האם התוצאה שחזרה מכילה את הנתונים
    if (data && data.results && data.results.length > 0) {
      const lat=data.results[0].geometry.lat;
      const lng  = data.results[0].geometry.lng;
      // בדיקה אם הקואורדינטות תקינות
      if (typeof lat === 'number' && typeof lng === 'number'
        && lat >= -90 && lat <= 90
        && lng >= -180 && lng <= 180) {
        const result = { lat, lng };
        addressCache.set(address, result); // שומר את התוצאה בזיכרון
        return result;
      }
      else {
        console.log("קואורדינטות לא תקינות:", lat, lng);
        return null;
    }
  }
    else {
      return null;
    }
  }
catch (error) {//טיפול בשגיאה במרת הכתובת
    console.error('שגיאה בהמרת כתובת:', error);
    return null;
  }
};

//מנגנון Limit
async function limitConcurrency<T,R>(
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


export const getValidStores = async () => {
  const stores: Store[] = db.Store;//שליפת כל הסניפים מהמסד נתונים
  //בדיקת תקינות של הכתובת
  const isValidAddress = (store: Store) => {
    return (
      typeof store.address === 'string' &&
      store.address.trim() !== '' &&
      typeof store.city === 'string' &&
      store.city.trim() !== ''
    );
  };
  //סינון הסניפים עם כתובת תקינה
  const results = stores.filter(isValidAddress).map((store: Store) => ({
    storeId: store.storeId,
    chainId: store.chainId,
    chainName: store.chainName,
    storeName:store.storeName,
    address: store.address,
    city: store.city
  }));

  const addressCoords =await limitConcurrency(results, async (s) => {
      const fullAddress = `${s.address}, ${s.city}`;
      const coords = await geocodeAddress(fullAddress);//שיחזיר קורדינטה geocodeAddress-שליחת הכתובת ל
      //הנתונים שיחזרו מהפונקציה 
      return {
        storeId: s.storeId,
        chainId: s.chainId,
        chainName: s.chainName,
        storeName: s.storeName,
        fullAddress:fullAddress?? null,
        latitude: coords?.lat ?? null,
        longitude: coords?.lng ?? null
      };
    },10)//מגביל את מס הקריאות במקביל ל- 10
return addressCoords;
};