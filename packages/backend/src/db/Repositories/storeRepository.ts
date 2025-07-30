// import { SupabaseClient } from "@supabase/supabase-js";
// import { IStoreRepository } from "../IRepositories/IStoreRepository";
// import { Store } from "../../../../shared/src/store";

// export class StoreRepository implements IStoreRepository {
//     private readonly tableName = 'store';

//     constructor(private supabase: SupabaseClient) { }

//     // פונקציה להמרה ל-snake_case
//     private toDbStore(store: Store) {
//         return {
//             store_pk: store.storePK, // Assuming storePK is a unique identifier for the store
//             store_id: store.storeId,
//             chain_name: store.chainName,
//             chain_id: store.chainId,
//             sub_chain_name: store.subChainName,
//             sub_chain_id: store.subChainId,
//             store_name: store.storeName,
//             address: store.address,
//             city: store.city,
//             zip_code: store.zipCode,
//         };
//     }

//     private fromDbStore(db: any): Store {
//         return {
//           storePK: db.store_pk,
//           storeId: db.store_id,
//           chainName: db.chain_name,
//           chainId: db.chain_id,
//           subChainName: db.sub_chain_name,
//           subChainId: db.sub_chain_id,
//           storeName: db.store_name,
//           address: db.address,
//           city: db.city,
//           zipCode: db.zip_code,
//         };
//       }

//     async addStore(store: Store): Promise<Store> {
//         try {
//             console.log(`Adding store: ${store.storeName} to Supabase`);
//             const { data, error } = await this.supabase
//                 .from(this.tableName)
//                 .insert([this.toDbStore(store)])
//                 .select('*');

//             if (error) {
//                 console.error('Error inserting store:', error);
//                 throw new Error(`Failed to add store: ${error.message}`);
//             }

//             if (!data || data.length === 0) {
//                 throw new Error('No data returned after adding store.');
//             }

//             console.log('Store added successfully:', data[0]);
//             return store;
//         } catch (error: any) {
//             console.error(`Error in addStore: ${error.message}`);
//             throw error;
//         }
//     }

//     async addManyStores(stores: Store[]): Promise<Store[]> {
//         if (stores.length === 0) {
//             console.log('No stores to add.');
//             return [];
//         }

//         try {
//             console.log(`Adding ${stores.length} stores to Supabase via bulk insert`);
//             const dbStores = stores.map(store => this.toDbStore(store));
//             const { data, error } = await this.supabase
//                 .from(this.tableName)
//                 .insert(dbStores)
//                 .select('*');

//             if (error) {
//                 console.error('Error inserting multiple stores:', error);
//                 throw new Error(`Failed to add multiple stores: ${error.message}`);
//             }

//             if (!data) {
//                 throw new Error('No data returned after adding multiple stores.');
//             }

//             console.log(`${data.length} stores added successfully.`);
//             return stores;
//         } catch (error: any) {
//             console.error(`Error in addManyStores: ${error.message}`);
//             throw error;
//         }
//     }

//     async updateStore(store: Store): Promise<Store> {
//         try {
//             console.log(`Updating store: ${store.storeName} (id: ${store.storePK}) in Supabase`);
//             const { data, error } = await this.supabase
//                 .from(this.tableName)
//                 .update(this.toDbStore(store))
//                 .eq('store_pk', store.storePK)
//                 .select('*');

//             if (error) {
//                 console.error('Error updating store:', error);
//                 throw new Error(`Failed to update store: ${error.message}`);
//             }

//             if (!data || data.length === 0) {
//                 throw new Error('No data returned after updating store.');
//             }

//             console.log('Store updated successfully:', data[0]);
//             return store;
//         } catch (error: any) {
//             console.error(`Error in updateStore: ${error.message}`);
//             throw error;
//         }
//     }

//     async updateManyStores(stores: Store[]): Promise<Store[]> {
//         if (stores.length === 0) {
//             console.log('No stores to update.');
//             return [];
//         }

//         try {
//             console.log(`Updating ${stores.length} stores in Supabase`);
//             const updatedStores: Store[] = [];
//             for (const store of stores) {
//                 const { data, error } = await this.supabase
//                     .from(this.tableName)
//                     .update(this.toDbStore(store))
//                     .eq('store_pk', store.storePK)
//                     .select('*');

//                 if (error) {
//                     console.error(`Error updating store with id ${store.storePK}:`, error);
//                     throw new Error(`Failed to update store with id ${store.storePK}: ${error.message}`);
//                 }

//                 if (!data || data.length === 0) {
//                     throw new Error(`No data returned after updating store with id ${store.storePK}.`);
//                 }

//                 updatedStores.push(store);
//             }
//             console.log(`${updatedStores.length} stores updated successfully.`);
//             return updatedStores;
//         } catch (error: any) {
//             console.error(`Error in updateManyStores: ${error.message}`);
//             throw error;
//         }
//     }

//     async getAllStores(): Promise<Store[]> {
//         try {
//           const { data, error } = await this.supabase
//             .from(this.tableName)
//             .select('*');
    
//           if (error) {
//             console.error('Error fetching all stores:', error);
//             throw new Error(`Failed to fetch stores: ${error.message}`);
//           }
    
          
    
//           return (data || []).map(this.fromDbStore); // ← ההמרה כאן
//         } catch (error: any) {
//           console.error(`Error in getAllStores: ${error.message}`);
//           throw error;
//         }
//       }
    
//     async getStoreById(storePK: string): Promise<Store | null> {
//         try {
//             const { data, error } = await this.supabase
//                 .from(this.tableName)
//                 .select('*')
//                 .eq('store_pk', storePK)
//                 .single();

//             if (error) {
//                 if (error.code === 'PGRST116') { // Not found
//                     return null;
//                 }
//                 console.error('Error fetching store by id:', error);
//                 throw new Error(`Failed to fetch store: ${error.message}`);
//             }

//             return data;
//         } catch (error: any) {
//             console.error(`Error in getStoreById: ${error.message}`);
//             throw error;
//         }
//     }

//     async deleteStoreById(storePK: string): Promise<void> {
//         try {
//             const { error } = await this.supabase
//                 .from(this.tableName)
//                 .delete()
//                 .eq('store_pk', storePK);

//             if (error) {
//                 console.error('Error deleting store:', error);
//                 throw new Error(`Failed to delete store: ${error.message}`);
//             }
//             console.log(`Store with id ${storePK} deleted successfully.`);
//         } catch (error: any) {
//             console.error(`Error in deleteStoreById: ${error.message}`);
//             throw error;
//         }
//     }
// }


import { SupabaseClient } from "@supabase/supabase-js";
import { IStoreRepository } from "../IRepositories/IStoreRepository";
import { Store } from "@smartcart/shared";

export class StoreRepository implements IStoreRepository {
    private readonly tableName = 'store';

    constructor(private supabase: SupabaseClient) { }

    // פונקציה להמרה ל-snake_case
    private toDbStore(store: Store) {
        return {
            store_pk: store.storePK, // Assuming storePK is a unique identifier for the store
            store_id: store.storeId,
            chain_name: store.chainName,
            chain_id: store.chainId,
            sub_chain_name: store.subChainName,
            sub_chain_id: store.subChainId,
            store_name: store.storeName,
            address: store.address,
            city: store.city,
            zip_code: store.zipCode,
            latitude: store.latitude ?? null,
            longitude: store.longitude ?? null,
        };
    }

    private fromDbStore(db: any): Store {
        return {
            storePK: db.store_pk,
            storeId: db.store_id,
            chainName: db.chain_name,
            chainId: db.chain_id,
            subChainName: db.sub_chain_name,
            subChainId: db.sub_chain_id,
            storeName: db.store_name,
            address: db.address,
            city: db.city,
            zipCode: db.zip_code,
            latitude: db.latitude ?? null,
            longitude: db.longitude ?? null,
        };
    }

    async addStore(store: Store): Promise<Store> {
        try {
            console.log(`Upserting store: ${store.storeName} to Supabase`);
            const { data, error } = await this.supabase
                .from(this.tableName)
                .upsert([this.toDbStore(store)], { onConflict: 'store_pk' }) // שנה בהתאם לשם העמודה שלך
                .select('*');

            if (error) {
                console.error('Error upserting store:', error);
                throw new Error(`Failed to upsert store: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after upserting store.');
            }

            console.log('Store upserted successfully:', data[0]);
            return store;
        } catch (error: any) {
            console.error(`Error in addStore: ${error.message}`);
            throw error;
        }
    }

    async addManyStores(stores: Store[]): Promise<Store[]> {
        if (stores.length === 0) {
            console.log('No stores to add.');
            return [];
        }

        try {
            const dbStores = stores.map(store => this.toDbStore(store));
            const { data, error } = await this.supabase
                .from(this.tableName)
                .upsert(dbStores, { onConflict: 'store_pk' })
                .select('*');

            if (error) {
                console.error('Error upserting multiple stores:', error);
                throw new Error(`Failed to upsert multiple stores: ${error.message}`);
            }

            console.log(`${data?.length} stores upserted successfully.`);
            return stores;
        } catch (error: any) {
            console.error(`Error in addManyStores: ${error.message}`);
            throw error;
        }
    }

    async updateStore(store: Store): Promise<Store> {
        try {
            console.log(`Updating store: ${store.storeName} (id: ${store.storePK}) in Supabase`);
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update(this.toDbStore(store))
                .eq('store_pk', store.storePK)
                .select('*');

            if (error) {
                console.error('Error updating store:', error);
                throw new Error(`Failed to update store: ${error.message}`);
            }
            if (!data || data.length === 0) {
                throw new Error('No data returned after updating store.');
            }
            console.log('Store updated successfully:', data[0]);
            return store;
        } catch (error: any) {
            console.error(`Error in updateStore: ${error.message}`);
            throw error;
        }
    }

    async updateManyStores(stores: Store[]): Promise<Store[]> {
        if (stores.length === 0) {
            console.log('No stores to update.');
            return [];
        }
        try {
            console.log(`Updating ${stores.length} stores in Supabase`);
            const updatedStores: Store[] = [];
            for (const store of stores) {
                const { data, error } = await this.supabase
                    .from(this.tableName)
                    .update(this.toDbStore(store))
                    .eq('store_pk', store.storePK)
                    .select('*');

                if (error) {
                    console.error(`Error updating store with id ${store.storePK}:`, error);
                    throw new Error(`Failed to update store with id ${store.storePK}: ${error.message}`);
                }
                if (!data || data.length === 0) {
                    throw new Error(`No data returned after updating store with id ${store.storePK}.`);
                }
                updatedStores.push(store);
            }
            console.log(`${updatedStores.length} stores updated successfully.`);
            return updatedStores;
        } catch (error: any) {
            console.error(`Error in updateManyStores: ${error.message}`);
            throw error;
        }
    }

    async getAllStores(): Promise<Store[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*');
            if (error) {
                console.error('Error fetching all stores:', error);
                throw new Error(`Failed to fetch stores: ${error.message}`);
            }
            return (data || []).map(this.fromDbStore); // ← ההמרה כאן
        } catch (error: any) {
            console.error(`Error in getAllStores: ${error.message}`);
            throw error;
        }
    }

    // זו הפונקציה getAllStoresMinimal שהגיעה מהצד של 'main' (או זו שאת רוצה לשמור)
    // שימו לב שהיא לא מוגדרת בממשק IStoreRepository שצירפת.
    // אם היא נחוצה, יש להוסיף אותה לממשק.
    // אנו נשמור אותה כרגע כפי שהיא מ'main' מכיוון שהיא יעילה יותר מבחינת בחירת נתונים.
    async getAllStoresMinimal(): Promise<{ store_pk: string; latitude?: number; longitude?: number }[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('store_pk, latitude, longitude');

            if (error) {
                console.error('Error fetching minimal store data:', error);
                throw new Error(`Failed to fetch stores: ${error.message}`);
            }

            return data || [];
        } catch (error: any) {
            console.error(`Error in getAllStoresMinimal: ${error.message}`);
            throw error;
        }
    }

    async getStoreById(storePK: string): Promise<Store | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('store_pk', storePK)
                .single();
            if (error) {
                if (error.code === 'PGRST116') { // Not found
                    return null;
                }
                console.error('Error fetching store by id:', error);
                throw new Error(`Failed to fetch store: ${error.message}`);
            }
            return data;
        } catch (error: any) {
            console.error(`Error in getStoreById: ${error.message}`);
            throw error;
        }
    }

    async deleteStoreById(storePK: string): Promise<void> {
        try {
            const { error } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('store_pk', storePK);
            if (error) {
                console.error('Error deleting store:', error);
                throw new Error(`Failed to delete store: ${error.message}`);
            }
            console.log(`Store with id ${storePK} deleted successfully.`);
        } catch (error: any) {
            console.error(`Error in deleteStoreById: ${error.message}`);
            throw error;
        }
    }
}