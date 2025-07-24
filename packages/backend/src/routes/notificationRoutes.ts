// src/routes/notificationRoutes.ts
import { Router } from 'express';
import notificationController from '../controllers/notificationController';

const router = Router();

// הוספת התראה חדשה
router.post('/', notificationController.addNotification);

// מחיקת התראה לפי ID
router.delete('/:notificationId', notificationController.deleteNotification);

// עדכון סטטוס התראה (הפעלה/כיבוי)
router.patch('/:notificationId/:isActive', notificationController.toggleNotificationStatus);

// שליפת כל ההתראות לפי משתמש
router.get('/user/:username', notificationController.getNotificationsByUsername);

// שליפת כל ההתראות
router.get('/', notificationController.getAllNotifications);

// שליפת התראות לפי קוד מוצר
router.get('/product/:productCode', notificationController.getNotificationsByProductCode);

// שליפת התראות פעילות שעדיין לא הופעלו
router.get('/active/untriggered', notificationController.getActiveUntriggeredNotifications);

// בדיקת סטטוס התראה
router.get('/:notificationId/status', notificationController.getNotificationStatus);

// סימון התראה כמופעלת
router.patch('/:notificationId/trigger', notificationController.markNotificationAsTriggered);

// עדכון סוג התראה
router.patch('/:notificationId/type', notificationController.updateNotificationType);

// השבתת כל ההתראות של משתמש
router.patch('/user/:username/deactivate', notificationController.deactivateAllUserNotifications);

// הפעלת כל ההתראות הפעילות של מוצר
router.patch('/product/:productCode/trigger', notificationController.triggerAllActiveNotificationsForProduct);

export default router;
