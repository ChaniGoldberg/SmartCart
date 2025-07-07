export interface Item {
  itemCode: number;//pk
  itemId: number;
  itemType: number;
  itemName: string;
  correctItemName: string;           // שם מתוקן של המוצר
  manufacturerName: string;
  manufactureCountry: string;
  manufacturerItemDescription: string;
  itemStatus: boolean;
  tagsId?: number[];//fk
}