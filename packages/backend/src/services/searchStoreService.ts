import { Store } from "@smartcart/shared";
import { StoreRepository } from "../db/Repositories/storeRepository";
import { supabase } from "./supabase"; // ודא שאתה מייבא את מופע ה-supabase המאותחל

export const searchStoresService = async (name: string): Promise<Store[]> => {
    
    const storeRepository = new StoreRepository(supabase);

    const stores: Store[] = await storeRepository.getAllStores(); 

    // סינון הסניפים לפי שם
    const filteredStores = stores.filter(store =>
        store.storeName.toLowerCase().includes(name.toLowerCase())
    );
    return filteredStores;
};
