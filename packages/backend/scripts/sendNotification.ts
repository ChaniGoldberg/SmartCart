import path from 'path';
import dotenv from 'dotenv';
dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
});
import notificationService from '../src/services/notificationsService';
import promotionsService from '../src/services/promotionServices';
import { sendEmail } from '../src/utils/sendEmail';
import { Notification } from '@smartcart/shared/src/notification';
import 'dotenv/config';
import { UserRepository } from '../../backend/src/db/Repositories/userRepository';
import { supabase } from '../../backend/src/services/supabase';
console.log(":rocket: Starting notification scan...");
const userRepository = new UserRepository(supabase);
(async () => {
  try {
    console.log("Fetching active untriggered notifications");
    const notifications = await notificationService.getActiveUntriggeredNotifications();
    console.log(`Found ${notifications.length} active untriggered notifications`);
    for (const notification of notifications) {
      const { productCode, username, notificationType } = notification;
      console.log(':mag: Notification:', { productCode, username, notificationType });
      const user = await userRepository.getUserById(username);
      console.log(':closed_lock_with_key: User from DB:', user);
      if (!user) {
        console.warn(`:warning: No user found for username ${username}. Skipping.`);
        continue;
      }
      const userEmail = user.email;
      if (!userEmail) {
        console.warn(`:warning: No email found for user ${username}. Skipping.`);
        continue;
      }
      if (!user.preferred_store) {
        console.error(`:x: Invalid or missing storePK for user ${username} (userId: ${user.userId})`);
        continue;
      }
      const promos = await promotionsService.getPromotionsByStoreIdAndItemCode(
        user.preferred_store,
        productCode
      );
      if (!promos || promos.length === 0) {
        console.log(`:x: No promotions for ${productCode}. Skipping user ${username}`);
        continue;
      }
      const message = `יש מבצע חדש על המוצר "${productCode}"! תבדוק באתר Smartcart :fire:`;
      if (notificationType === 'email') {
        await sendEmail(userEmail, message);
      }
      if (notification.notificationId) {
        await notificationService.markNotificationAsTriggered(notification.notificationId);
      }
    }
    console.log(":tada: Notification process completed.");
  } catch (err: any) {
    console.error(":x: Error in notification script:", err.message || err);
  }
})();