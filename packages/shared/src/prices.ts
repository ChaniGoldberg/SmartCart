export interface Price {
  ChainId: string;               // מזהה רשת
  StoreId: string;               // מזהה סניף
  PriceUpdateDate: Date;         // תאריך עדכון המחיר האחרון של המוצר
  ItemCode: string;              // קוד מזהה ייחודי למוצר (ברקוד או קוד פנימי)
  ItemType: number;              // סוג המוצר (למשל: קטגוריה מספרית)
  ItemName: string;              // שם המוצר
  CorrectItemName: string;           // שם מתוקן של המוצר
  Category: string;              // קטגוריה של המוצר
  ManufacturerName: string;      // שם היצרן
  ManufactureCountry: string;    // מדינת ייצור
  ManufacturerItemDescription: string; // תיאור המוצר כפי שמופיע אצל היצרן
  UnitQty: string;               // כמות ביחידת מידה (למשל: 1, 500ml)
  Quantity: number;              // כמות המוצר (למשל: מספר יחידות במלאי)
  UnitOfMeasure: string;         // יחידת מידה (למשל: ק"ג, ליטר, יחידה)
  bIsWeighted: number;           // האם המוצר נמכר לפי משקל (1=כן, 0=לא)
  QtyInPackage: string;          // כמות ביחידה ארוזה (למשל: 6 בקבוקים במארז)
  ItemPrice: number;             // מחיר המוצר
  UnitOfMeasurePrice: number;    // מחיר ליחידת מידה
  AllowDiscount: number;         // האם מותר להחיל הנחה (1=כן, 0=לא)
  ItemStatus: number;            // סטטוס המוצר (למשל: פעיל, לא פעיל)
  ItemId: number;              // מזהה פנימי של המוצר 
}