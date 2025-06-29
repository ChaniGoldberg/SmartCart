import { Tag } from "./tags";
export interface Item {
  itemId: number;//pk
  itemCode: number;
  itemType: number;
  itemName: string;
  correctItemName: string;           // שם מתוקן של המוצר
  manufacturerName: string;
  manufactureCountry: string;
  manufacturerItemDescription: string;
  itemStatus: boolean;
  tag: Tag[];//fk
}