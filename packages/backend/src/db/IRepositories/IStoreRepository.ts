import { Store } from "../../../../shared/src/store";

export interface IStoreRepository {
  addStore(store: Store): Promise<Store>;
  addManyStores(stores: Store[]): Promise<Store[]>;
  updateStore(store: Store): Promise<Store>;
  updateManyStores(stores: Store[]): Promise<Store[]>;
  getAllStores(): Promise<Store[]>;
  getStoreById(storeId: number): Promise<Store | null>;
  deleteStoreById(storeId: number): Promise<void>;
}