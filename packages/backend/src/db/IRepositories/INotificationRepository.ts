

// src/IRepositories/INotificationRepository.ts
import { Notification } from "@smartcart/shared/src/notification";

export interface INotificationRepository {
  // הוספה
  addNotification(notification: Notification): Promise<Notification>;
  
  // בדיקת סטטוס
  getNotificationStatus(notificationId: number): Promise<{ isActive: boolean; hasBeenTriggered: boolean } | null>;
  
  // הפעלה/כיבוי
  toggleNotificationStatus(notificationId: number, isActive: boolean): Promise<boolean>;
  
  // סימון כמופעלת
  markNotificationAsTriggered(notificationId: number): Promise<boolean>;
  
  // שליפות
  getAllNotifications(): Promise<Notification[]>;
  getNotificationsByUsername(username: string): Promise<Notification[]>;
  getNotificationsByProductCode(productCode: string): Promise<Notification[]>;
  getActiveUntriggeredNotifications(): Promise<Notification[]>;
  
  // מחיקה
  deleteNotification(notificationId: number): Promise<void>;
  
  // עדכון
  updateNotificationType(notificationId: number, notificationType: 'whatsapp' | 'email' | 'sms'): Promise<Notification | null>;
}
