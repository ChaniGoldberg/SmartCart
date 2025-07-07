export class StoreLocationDto {
  storeId: number;
  chainId: number;
  chainName: string;
  storeName: string;
  fullAddress: string | null;
  latitude: number | null;
  longitude: number | null;

constructor(storeId:number,chainId:number,chainName:string,storeName:string,fullAddress:string|null,latitude:number|null,longitude:number|null) {
this.storeId=storeId;
this.chainId=chainId;
this.chainName=chainName; 
this.storeName=storeName;
this.fullAddress=fullAddress;
this.latitude=latitude;
this.longitude=longitude;
  }
}
 