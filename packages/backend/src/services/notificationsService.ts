
// src/services/notificationService.ts
import { INotificationRepository } from "../db/IRepositories/INotificationRepository";
import { Notification } from "@smartcart/shared/src/notification";
import { NotificationRepository } from "../db/Repositories/notificationRepository";
import { supabase } from "./supabase";

const notificationRepository = new NotificationRepository(supabase);

export class NotificationService implements INotificationRepository {
    private notificationRepository: INotificationRepository;

    constructor() {
        this.notificationRepository = notificationRepository;
    }

    // הוספת התראה חדשה
    async addNotification(notification: Notification): Promise<Notification> {
        return await this.notificationRepository.addNotification(notification);
    }

    // בדיקת סטטוס התראה
    async getNotificationStatus(notificationId: number): Promise<{ isActive: boolean; hasBeenTriggered: boolean } | null> {
        return await this.notificationRepository.getNotificationStatus(notificationId);
    }

    // הפעלה/כיבוי של התראה
    async toggleNotificationStatus(notificationId: number, isActive: boolean): Promise<boolean> {
        return await this.notificationRepository.toggleNotificationStatus(notificationId, isActive);
    }

    // סימון התראה כמופעלת
    async markNotificationAsTriggered(notificationId: number): Promise<boolean> {
        return await this.notificationRepository.markNotificationAsTriggered(notificationId);
    }

    // שליפת כל ההתראות
    async getAllNotifications(): Promise<Notification[]> {
        return await this.notificationRepository.getAllNotifications();
    }

    // שליפת התראות לפי משתמש
    async getNotificationsByUsername(username: string): Promise<Notification[]> {
        return await this.notificationRepository.getNotificationsByUsername(username);
    }

    // שליפת התראות לפי קוד מוצר
    async getNotificationsByProductCode(productCode: string): Promise<Notification[]> {
        return await this.notificationRepository.getNotificationsByProductCode(productCode);
    }

    // שליפת התראות פעילות שעדיין לא הופעלו
    async getActiveUntriggeredNotifications(): Promise<Notification[]> {
        return await this.notificationRepository.getActiveUntriggeredNotifications();
    }

    // מחיקת התראה
    async deleteNotification(notificationId: number): Promise<void> {
        await this.notificationRepository.deleteNotification(notificationId);
    }

    // עדכון סוג התראה
    async updateNotificationType(notificationId: number, notificationType: 'whatsapp' | 'email' | 'sms'): Promise<Notification | null> {
        return await this.notificationRepository.updateNotificationType(notificationId, notificationType);
    }

    // פונקציה נוספת: השבתת כל ההתראות של משתמש
    async deactivateAllUserNotifications(username: string): Promise<void> {
        const userNotifications = await this.getNotificationsByUsername(username);
        
        for (const notification of userNotifications) {
            if (notification.isActive && notification.notificationId) {
                await this.toggleNotificationStatus(notification.notificationId, false);
            }
        }
    }

    // פונקציה נוספת: סימון כל ההתראות הפעילות של מוצר כמופעלות
    async triggerAllActiveNotificationsForProduct(productCode: string): Promise<void> {
        const productNotifications = await this.getNotificationsByProductCode(productCode);
        
        for (const notification of productNotifications) {
            if (notification.isActive && !notification.hasBeenTriggered && notification.notificationId) {
                await this.markNotificationAsTriggered(notification.notificationId);
            }
        }
    }
}

// יצירת מופע של השירות לייצוא
const notificationService = new NotificationService();

export default notificationService;



