export interface Alert {
    alertId: number; //PK
    priceId: number; // FK - מזהה מוצר שקשור להתראה
    userId: number; // FK - מזהה המשתמש שיצר את ההתראה
    active: boolean; // האם ההתראה פעילה (1=כן, 0=לא)
    lastTriggered: Date | null; //null: date ?התאריך האחרון שבו ההתראה הופעלה
    minDiscount: number; // אחוז ההנחה המינימלי להפעלת ההתראה
    type: string; // סוג ההתראה (למשל: "price drop", "new product", etc.)
}