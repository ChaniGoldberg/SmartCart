import { Store } from "@smartcart/shared";

export interface IStoreRepository {
  addStore(store: Store): Promise<Store>;
  addManyStores(stores: Store[]): Promise<Store[]>;
  updateStore(store: Store): Promise<Store>;
  updateManyStores(stores: Store[]): Promise<Store[]>;
  getAllStores(): Promise<Store[]>;
  getStoreById(storePK: string): Promise<Store | null>;
  deleteStoreById(storePK: string): Promise<void>;
}