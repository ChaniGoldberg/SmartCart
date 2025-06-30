export interface Price {
  priceId: number;  //pk           // מזהה ייחודי למחיר
  storeId: number;  //fk   
  itemId: number;   //fk 
  price: number;       // מחיר המוצר
  priceUpdateDate: Date;         // תאריך עדכון המחיר האחרון של המוצר
  unitQuantity: string;               // כמות ביחידת מידה (למשל: 1, 500ml)
  quantity: number;              // כמות המוצר (למשל: מספר יחידות במלאי)
  unitOfMeasure: string;         // יחידת מידה (למשל: ק"ג, ליטר, יחידה)
  isWeighted: boolean;           // האם המוצר נמכר לפי משקל (1=כן, 0=לא)
  quantityInPackage: string;    // כמות ביחידה ארוזה (למשל: 6 בקבוקים במארז)            
  unitOfMeasurePrice: number;    // מחיר ליחידת מידה
  allowDiscount: boolean;         // האם מותר להחיל הנחה 
}