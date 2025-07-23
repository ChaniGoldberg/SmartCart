export class StoreLocationDto {
  storePK: string;
  chainId: string;
  chainName: string;
  storeName: string;
  fullAddress: string;
  latitude: number ;
  longitude: number;

constructor(storePK:string,chainId:string,chainName:string,storeName:string,fullAddress:string,latitude:number,longitude:number) {
this.storePK=storePK;
this.chainId=chainId;
this.chainName=chainName; 
this.storeName=storeName;
this.fullAddress=fullAddress;
this.latitude=latitude;
this.longitude=longitude;
  }
}
 