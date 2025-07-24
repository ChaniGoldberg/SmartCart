


// src/repositories/notificationRepository.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { INotificationRepository } from "../IRepositories/INotificationRepository";
import { Notification } from "@smartcart/shared/src/notification";


export class NotificationRepository implements INotificationRepository {
  private readonly tableName = 'notification';

  constructor(private supabase: SupabaseClient) { }

  // פונקציה להמרה ל-snake_case עבור Notification
  private toDbNotification(notification: Notification) {
    return {
      notification_id: notification.notificationId,
      product_code: notification.productCode,
      username: notification.username,
      is_active: notification.isActive,
      has_been_triggered: notification.hasBeenTriggered,
      notification_type: notification.notificationType,
      createdat: notification.createdAt?.toISOString() || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  // פונקציה להמרה מ-snake_case ל-camelCase
  private fromDbNotification(dbNotification: any): Notification {
    return {
      notificationId: dbNotification.notification_id,
      productCode: dbNotification.product_code,
      username: dbNotification.username,
      isActive: dbNotification.is_active,
      hasBeenTriggered: dbNotification.has_been_triggered,
      notificationType: dbNotification.notification_type,
      createdAt: new Date(dbNotification.createdat),
      updatedAt: new Date(dbNotification.updated_at),
    };
  }

  // הוספת התראה חדשה
  async addNotification(notification: Notification): Promise<Notification> {
    try {
      console.log(`Adding notification for product ${notification.productCode} to user ${notification.username}`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .insert([this.toDbNotification(notification)])
        .select('*');

      if (error) {
        console.error('Error inserting notification:', error);
        throw new Error(`Failed to add notification: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('No data returned after adding notification.');
      }

      const addedNotification = this.fromDbNotification(data[0]);
      console.log('Notification added successfully:', addedNotification);
      return addedNotification;
    } catch (error: any) {
      console.error(`Error in addNotification: ${error.message}`);
      throw error;
    }
  }

  // בדיקת סטטוס התראה
  async getNotificationStatus(notificationId: number): Promise<{ isActive: boolean; hasBeenTriggered: boolean } | null> {
    try {
      console.log(`Checking status for notification ${notificationId}`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('is_active, has_been_triggered')
        .eq('notification_id', notificationId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.log(`Notification ${notificationId} not found`);
          return null;
        }
        console.error('Error checking notification status:', error);
        throw new Error(`Failed to check notification status: ${error.message}`);
      }

      return {
        isActive: data.is_active,
        hasBeenTriggered: data.has_been_triggered
      };
    } catch (error: any) {
      console.error(`Error in getNotificationStatus: ${error.message}`);
      throw error;
    }
  }

  // הפעלה/כיבוי של התראה
  async toggleNotificationStatus(notificationId: number, isActive: boolean): Promise<boolean> {
    try {
      console.log(`${isActive ? 'Activating' : 'Deactivating'} notification ${notificationId}`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          is_active: !isActive,
          updated_at: new Date().toISOString()
        })
        .eq('notification_id', notificationId)
        .select('is_active');
      if (error) {
        console.error('Error toggling notification status:', error);
        throw new Error(`Failed to toggle notification status: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Notification not found or not updated.');
      }
      console.log('Attempting to update', notificationId, isActive);

      console.log(`Notification ${notificationId} ${isActive ? 'activated' : 'deactivated'} successfully`);
      return data[0].is_active;
    } catch (error: any) {
      console.error(`Error in toggleNotificationStatus: ${error.message}`);
      throw error;
    }
  }

  // סימון התראה כמופעלת (כשהיא נשלחה)
  async markNotificationAsTriggered(notificationId: number): Promise<boolean> {
    try {
      console.log(`Marking notification ${notificationId} as triggered`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          has_been_triggered: true,
          updated_at: new Date().toISOString()
        })
        .eq('notification_id', notificationId)
        .select('has_been_triggered');

      if (error) {
        console.error('Error marking notification as triggered:', error);
        throw new Error(`Failed to mark notification as triggered: ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Notification not found or not updated.');
      }

      console.log(`Notification ${notificationId} marked as triggered successfully`);
      return data[0].has_been_triggered;
    } catch (error: any) {
      console.error(`Error in markNotificationAsTriggered: ${error.message}`);
      throw error;
    }
  }

  // שליפת כל ההתראות
  async getAllNotifications(): Promise<Notification[]> {
    try {
      console.log('Fetching all notifications');

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`*`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all notifications:', error);
        throw new Error(`Failed to fetch notifications: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log('No notifications found');
        return [];
      }

      const notifications = data.map((dbNotification: any) => ({
        notificationId: dbNotification.notificationid,
        productCode: dbNotification.productcode,
        username: dbNotification.username,
        isActive: dbNotification.isactive,
        hasBeenTriggered: dbNotification.hasbeentriggered,
        notificationType: dbNotification.notificationtype,
        createdAt: dbNotification.createdat ? new Date(dbNotification.createdat) : undefined,
        updatedAt: dbNotification.updatedat ? new Date(dbNotification.updatedat) : undefined,
      }));

      console.log(`Found ${notifications.length} notifications`);
      return notifications;
    } catch (error: any) {
      console.error(`Error in getAllNotifications: ${error.message}`);
      throw error;
    }
  }

  // שליפת התראות לפי משתמש
  async getNotificationsByUsername(username: string): Promise<Notification[]> {
    try {
      console.log(`Fetching notifications for user: ${username}`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('user_name', username)
        .order('created_at', { ascending: false });

      if (error) {
        console.error(`Error fetching notifications for user ${username}:`, error);
        throw new Error(`Failed to fetch notifications for user: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log(`No notifications found for user ${username}`);
        return [];
      }

      const notifications = data.map(dbNotification => this.fromDbNotification(dbNotification));
      console.log(`Found ${notifications.length} notifications for user ${username}`);
      return notifications;
    } catch (error: any) {
      console.error(`Error in getNotificationsByUsername: ${error.message}`);
      throw error;
    }
  }

  // שליפת התראות לפי קוד מוצר
  async getNotificationsByProductCode(productCode: string): Promise<Notification[]> {
    try {
      console.log(`Fetching notifications for product: ${productCode}`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('product_code', productCode)
        .order('createdat', { ascending: false });

      if (error) {
        console.error(`Error fetching notifications for product ${productCode}:`, error);
        throw new Error(`Failed to fetch notifications for product: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log(`No notifications found for product ${productCode}`);
        return [];
      }

      const notifications = data.map(dbNotification => this.fromDbNotification(dbNotification));
      console.log(`Found ${notifications.length} notifications for product ${productCode}`);
      return notifications;
    } catch (error: any) {
      console.error(`Error in getNotificationsByProductCode: ${error.message}`);
      throw error;
    }
  }

  // שליפת התראות פעילות שעדיין לא הופעלו
  async getActiveUntriggeredNotifications(): Promise<Notification[]> {
    try {
      console.log('Fetching active untriggered notifications');

      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('*')
        .eq('is_active', true)
        .eq('has_been_triggered', false)
        .order('createdat', { ascending: false });

      if (error) {
        console.error('Error fetching active untriggered notifications:', error);
        throw new Error(`Failed to fetch active untriggered notifications: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log('No active untriggered notifications found');
        return [];
      }

      const notifications = data.map(dbNotification => this.fromDbNotification(dbNotification));
      console.log(`Found ${notifications.length} active untriggered notifications`);
      return notifications;
    } catch (error: any) {
      console.error(`Error in getActiveUntriggeredNotifications: ${error.message}`);
      throw error;
    }
  }

  // מחיקת התראה
  async deleteNotification(notificationId: number): Promise<void> {
    try {
      console.log(`Deleting notification ${notificationId}`);

      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('notification_id', notificationId);

      if (error) {
        console.error('Error deleting notification:', error);
        throw new Error(`Failed to delete notification: ${error.message}`);
      }

      console.log(`Notification ${notificationId} deleted successfully`);
    } catch (error: any) {
      console.error(`Error in deleteNotification: ${error.message}`);
      throw error;
    }
  }

  // עדכון סוג התראה
  async updateNotificationType(notificationId: number, notificationType: 'whatsapp' | 'email' | 'sms'): Promise<Notification | null> {
    try {
      console.log(`Updating notification ${notificationId} type to ${notificationType}`);

      const { data, error } = await this.supabase
        .from(this.tableName)
        .update({
          notification_type: notificationType,
          updated_at: new Date().toISOString()
        })
        .eq('notification_id', notificationId)
        .select('*');

      if (error) {
        console.error('Error updating notification type:', error);
        throw new Error(`Failed to update notification type: ${error.message}`);
      }

      if (!data || data.length === 0) {
        console.log(`Notification ${notificationId} not found`);
        return null;
      }

      const updatedNotification = this.fromDbNotification(data[0]);
      console.log(`Notification ${notificationId} type updated successfully`);
      return updatedNotification;
    } catch (error: any) {
      console.error(`Error in updateNotificationType: ${error.message}`);
      throw error;
    }
  }
}



