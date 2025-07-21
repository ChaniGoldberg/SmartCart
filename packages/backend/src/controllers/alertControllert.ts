import { Request, Response } from 'express';
import { addProductAlert } from '../db/Repositories/back_notification';

// הוספת התראה חדשה
async function addAlert(
  req: Request<{}, {}, {
    price_id: string;
    user_id: string;
    is_active: boolean;
    was_triggered: boolean;
    min_discount_percent: number;
    notification_method: 'email' | 'whatsapp' | 'sms';
  }>,
  res: Response
): Promise<void> {
  try {
    const {
      price_id,
      user_id,
      is_active,
      was_triggered,
      min_discount_percent,
      notification_method
    } = req.body;

    // שליחה לריפוזיטורי
    const result = await addProductAlert(
      price_id,
      user_id,
      notification_method,
      min_discount_percent
    );

    // אם רוצים, אפשר לוודא גם ששדות ברירת מחדל (כמו is_active ו-was_triggered) עודכנו בריפוזיטורי לפי הלוגיקה שם
    res.status(201).json({ message: 'Alert created successfully', data: result });
  } catch (error) {
    console.error('Error adding alert:', error);
    res.status(500).json({ message: 'Failed to create alert' });
  }
}

// מחיקת התראה קיימת לפי מספר התראה
async function deleteAlert(
  req: Request<{ alertId: string }>,
  res: Response
): Promise<void> {
  // כאן תכתבי את הלוגיקה של המחיקה
}

// עדכון סטטוס (למשל הפעלה/ביטול) לפי מספר התראה
async function updateAlertStatus(
  req: Request<{ alertId: string }, {}, { is_active: boolean }>,
  res: Response
): Promise<void> {
  // כאן תכתבי את הלוגיקה של עדכון הסטטוס
}

// שליפת כל ההתראות לפי שם משתמש
async function getAllAlerts(
  req: Request<{ username: string }>,
  res: Response
): Promise<void> {
  // כאן תכתבי את הלוגיקה של השליפה
}
