

export interface Store {
  storePK: string; //pk `${chainId}-${subChainId}-${storeId}`
  storeId: number;
  chainName: string;
  chainId: number;
  subChainName: string;
  subChainId: number;
  storeName: string;
  address: string;
  city: string;
  zipCode: string;
}

