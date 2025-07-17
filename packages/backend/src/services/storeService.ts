import { Store } from "@smartcart/shared/src/store";
import { db } from "../db/dbProvider";

import { StoreLocationDto } from "@smartcart/shared";
import { StoreRepository } from '../db/Repositories/storeRepository';
import { databaseService } from '../services/database';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY
// בדיקה שהמשתנים קיימים
if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

//זכרון זמני לכתובות
const addressCache = new Map<string, { lat: number; lng: number } | null>();
const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;//מפתח ה־API של OpenCage

// פונקציה להמרת כתובת לקואורדינטות
//באמצעות שימוש ב- penCage API,
//הפונקציה מקבלת כתובת ומחזירה את הקואורדינטות שלה
const geocodeAddress = async (address: string): Promise<{ lat: number, lng: number } | null> => {
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
    const data: any = await response.json();
    //בדיקה האם התוצאה שחזרה מכילה את הנתונים
    if (data && data.results && data.results.length > 0) {
      const lat = data.results[0].geometry.lat;
      const lng = data.results[0].geometry.lng;
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
    return null;
  }
  catch (error) {//טיפול בשגיאה במרת הכתובת
    console.error('שגיאה בהמרת כתובת:', error);
    return null;
  }
};

//מנגנון Limit
async function limitConcurrency<T, R>(
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



const storeRepository = new StoreRepository(supabase);

export const getValidStores = async (): Promise<StoreLocationDto[]> => {
  try {
    const stores: Store[] = await storeRepository.getAllStores();

    const isValidAddress = (store: Store) => {
      return (
        typeof store.address === 'string' &&
        store.address.trim() !== '' &&
        typeof store.city === 'string' &&
        store.city.trim() !== ''
      );
    };


    const validStores = stores.filter(isValidAddress);

    const addressCoords = await limitConcurrency(validStores, async (s) => {
      const fullAddress = `${s.address}, ${s.city}`;

      const coords = await geocodeAddress(fullAddress);//שיחזיר קורדינטה geocodeAddress-שליחת הכתובת ל
      //הנתונים שיחזרו מהפונקציה 
      if (!coords) throw new Error(`אין קואורדינטות לכתובת: ${fullAddress}`);

      return new StoreLocationDto(
        s.storePK,
        s.chainId,
        s.chainName,
        s.storeName,
        fullAddress,
        coords?.lat || 0,
        coords?.lng || 0
      );
    }, 10);
console.log(addressCoords)
    return addressCoords;
  } catch (error) {
    
console.error('❌ Failed to load valid stores:', error);
    throw error;
  }
};

export async function addManyStoresToDb(stores: Store[]): Promise<void> {
  if (!stores || stores.length === 0) {
    console.warn("📭 לא התקבלו חנויות להוספה");
    return;
  }

  try {
    await storeRepository.addManyStores(stores); // שימוש בפונקציה שמוסיפה מערך
    console.log("✅ חנויות הוזנו בהצלחה");
  } catch (error) {
    console.error("❌ שגיאה בהוספת חנויות:", error);
    throw error;
  }
}



export async function addSOneStoreToDb(store: Store): Promise<void> {
  try {
    await storeRepository.addStore(store);
    console.log(`✅ חנות "${store.storeName}" הוזנה בהצלחה`);
  } catch (error) {
    console.error(`❌ שגיאה בהוספת חנות "${store.storeName}":`, error);
    throw error;
  }
}