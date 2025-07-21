// @smartcart/shared/src/notification.ts

export interface Notification {
    notificationId?: number; // PK - אופציונלי לצורך יצירה
    productCode: string; // קוד המוצר שקשור להתראה
    username: string; // שם המשתמש שיצר אתההתראה
    isActive: boolean; // האם ההתראה פעילה (true=כן, false=לא)
    hasBeenTriggered: boolean; // האם ההתראה כבר הופעלה
    notificationType: 'whatsapp' | 'email' | 'sms'; // סוג ההתראה
    createdAt?: Date; // תאריך יצירת ההתראה
    updatedAt?: Date; // תאריך עדכון אחרון
}

export default Notification;