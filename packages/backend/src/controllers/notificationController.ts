
// src/controllers/notificationController.ts
import { Request, Response } from 'express';
import notificationService from '../services/notificationsService';
import { Notification } from "@smartcart/shared/src/notification";

export class NotificationController {

  // הוספת התראה חדשה
  async addNotification(
    req: Request<{}, {}, {
      productCode: string;
      username: string;
      notificationType: 'whatsapp' | 'email' | 'sms';
      isActive?: boolean;
    }>,
    res: Response
  ): Promise<void> {
    try {
      const { productCode, username, notificationType, isActive = true } = req.body;

      // בדיקת שדות חובה
      if (!productCode || !username || !notificationType) {
        res.status(400).json({ 
          message: 'Missing required fields: productCode, username, notificationType' 
        });
        return;
      }

      // יצירת אובייקט התראה חדש
      const newNotification: Notification = {
        notificationId: 0, // temporary, will be set by DB
        productCode,
        username,
        notificationType,
        isActive,
        hasBeenTriggered: false,
        createdAt: new Date()
      };

      const result = await notificationService.addNotification(newNotification);

      res.status(201).json({ 
        message: 'Notification created successfully', 
        data: result 
      });
    } catch (error: any) {
      console.error('Error adding notification:', error);
      res.status(500).json({ 
        message: 'Failed to create notification', 
        error: error.message 
      });
    }
  }

  // מחיקת התראה לפי ID
  async deleteNotification(
    req: Request<{ notificationId: string }>,
    res: Response
  ): Promise<void> {
    try {
      const notificationId = parseInt(req.params.notificationId);

      if (isNaN(notificationId)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      await notificationService.deleteNotification(notificationId);

      res.status(200).json({ 
        message: 'Notification deleted successfully' 
      });
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ 
        message: 'Failed to delete notification', 
        error: error.message 
      });
    }
  }

  // עדכון סטטוס התראה (הפעלה/כיבוי)
  async toggleNotificationStatus(
    req: Request<{ notificationId: string }, {}, { isActive: boolean }>,
    res: Response
  ): Promise<void> {
    try {
      const notificationId = parseInt(req.params.notificationId);
      const { isActive } = req.body;

      if (isNaN(notificationId)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      if (typeof isActive !== 'boolean') {
        res.status(400).json({ message: 'isActive must be a boolean' });
        return;
      }

      const result = await notificationService.toggleNotificationStatus(notificationId, isActive);

      res.status(200).json({ 
        message: `Notification ${isActive ? 'activated' : 'deactivated'} successfully`,
        isActive: result
      });
    } catch (error: any) {
      console.error('Error updating notification status:', error);
      res.status(500).json({ 
        message: 'Failed to update notification status', 
        error: error.message 
      });
    }
  }

  // שליפת כל ההתראות לפי משתמש
  async getNotificationsByUsername(
    req: Request<{ username: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
      }

      const notifications = await notificationService.getNotificationsByUsername(username);

      res.status(200).json({ 
        message: 'Notifications retrieved successfully',
        data: notifications,
        count: notifications.length
      });
    } catch (error: any) {
      console.error('Error fetching notifications by username:', error);
      res.status(500).json({ 
        message: 'Failed to fetch notifications', 
        error: error.message 
      });
    }
  }

  // שליפת כל ההתראות
  async getAllNotifications(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const notifications = await notificationService.getAllNotifications();

      res.status(200).json({ 
        message: 'All notifications retrieved successfully',
        data: notifications,
        count: notifications.length
      });
    } catch (error: any) {
      console.error('Error fetching all notifications:', error);
      res.status(500).json({ 
        message: 'Failed to fetch notifications', 
        error: error.message 
      });
    }
  }

  // שליפת התראות לפי קוד מוצר
  async getNotificationsByProductCode(
    req: Request<{ productCode: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { productCode } = req.params;

      if (!productCode) {
        res.status(400).json({ message: 'Product code is required' });
        return;
      }

      const notifications = await notificationService.getNotificationsByProductCode(productCode);

      res.status(200).json({ 
        message: 'Notifications retrieved successfully',
        data: notifications,
        count: notifications.length
      });
    } catch (error: any) {
      console.error('Error fetching notifications by product code:', error);
      res.status(500).json({ 
        message: 'Failed to fetch notifications', 
        error: error.message 
      });
    }
  }

  // שליפת התראות פעילות שעדיין לא הופעלו
  async getActiveUntriggeredNotifications(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const notifications = await notificationService.getActiveUntriggeredNotifications();

      res.status(200).json({ 
        message: 'Active untriggered notifications retrieved successfully',
        data: notifications,
        count: notifications.length
      });
    } catch (error: any) {
      console.error('Error fetching active untriggered notifications:', error);
      res.status(500).json({ 
        message: 'Failed to fetch active untriggered notifications', 
        error: error.message 
      });
    }
  }

  // בדיקת סטטוס התראה
  async getNotificationStatus(
    req: Request<{ notificationId: string }>,
    res: Response
  ): Promise<void> {
    try {
      const notificationId = parseInt(req.params.notificationId);

      if (isNaN(notificationId)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      const status = await notificationService.getNotificationStatus(notificationId);

      if (!status) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      res.status(200).json({ 
        message: 'Notification status retrieved successfully',
        data: status
      });
    } catch (error: any) {
      console.error('Error fetching notification status:', error);
      res.status(500).json({ 
        message: 'Failed to fetch notification status', 
        error: error.message 
      });
    }
  }

  // סימון התראה כמופעלת
  async markNotificationAsTriggered(
    req: Request<{ notificationId: string }>,
    res: Response
  ): Promise<void> {
    try {
      const notificationId = parseInt(req.params.notificationId);

      if (isNaN(notificationId)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      const result = await notificationService.markNotificationAsTriggered(notificationId);

      res.status(200).json({ 
        message: 'Notification marked as triggered successfully',
        hasBeenTriggered: result
      });
    } catch (error: any) {
      console.error('Error marking notification as triggered:', error);
      res.status(500).json({ 
        message: 'Failed to mark notification as triggered', 
        error: error.message 
      });
    }
  }

  // עדכון סוג התראה
  async updateNotificationType(
    req: Request<{ notificationId: string }, {}, { notificationType: 'whatsapp' | 'email' | 'sms' }>,
    res: Response
  ): Promise<void> {
    try {
      const notificationId = parseInt(req.params.notificationId);
      const { notificationType } = req.body;

      if (isNaN(notificationId)) {
        res.status(400).json({ message: 'Invalid notification ID' });
        return;
      }

      if (!notificationType || !['whatsapp', 'email', 'sms'].includes(notificationType)) {
        res.status(400).json({ message: 'Invalid notification type. Must be: whatsapp, email, or sms' });
        return;
      }

      const result = await notificationService.updateNotificationType(notificationId, notificationType);

      if (!result) {
        res.status(404).json({ message: 'Notification not found' });
        return;
      }

      res.status(200).json({ 
        message: 'Notification type updated successfully',
        data: result
      });
    } catch (error: any) {
      console.error('Error updating notification type:', error);
      res.status(500).json({ 
        message: 'Failed to update notification type', 
        error: error.message 
      });
    }
  }

  // השבתת כל ההתראות של משתמש
  async deactivateAllUserNotifications(
    req: Request<{ username: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { username } = req.params;

      if (!username) {
        res.status(400).json({ message: 'Username is required' });
        return;
      }

      await notificationService.deactivateAllUserNotifications(username);

      res.status(200).json({ 
        message: `All notifications for user ${username} have been deactivated`
      });
    } catch (error: any) {
      console.error('Error deactivating user notifications:', error);
      res.status(500).json({ 
        message: 'Failed to deactivate user notifications', 
        error: error.message 
      });
    }
  }

  // הפעלת כל ההתראות הפעילות של מוצר
  async triggerAllActiveNotificationsForProduct(
    req: Request<{ productCode: string }>,
    res: Response
  ): Promise<void> {
    try {
      const { productCode } = req.params;

      if (!productCode) {
        res.status(400).json({ message: 'Product code is required' });
        return;
      }

      await notificationService.triggerAllActiveNotificationsForProduct(productCode);

      res.status(200).json({ 
        message: `All active notifications for product ${productCode} have been triggered`
      });
    } catch (error: any) {
      console.error('Error triggering product notifications:', error);
      res.status(500).json({ 
        message: 'Failed to trigger product notifications', 
        error: error.message 
      });
    }
  }
}

// יצירת מופע של הקונטרולר לייצוא
const notificationController = new NotificationController();
export default notificationController;











