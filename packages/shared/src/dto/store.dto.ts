export interface StoreLocationDto {
  storeId: number;
  chainId: number;
  chainName: string;
  storeName: string;
  fullAddress: string | null;
  latitude: number | null;
  longitude: number | null;
}
 