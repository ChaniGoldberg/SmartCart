import { Store } from "@smartcart/shared";
import { db } from "../db/dbProvider"; 

export const searchStoresService = async (name: string): Promise<Store[]> => {
    // שליפת כל הסניפים מהמסד נתונים
    const stores: Store[] = await db.Store;

    // סינון הסניפים לפי שם
    const filteredStores = stores.filter(store => 
        store.storeName.toLowerCase().includes(name.toLowerCase())
    );
    
    return filteredStores; 
};
