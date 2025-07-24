import express from 'express';
import { sendEmail } from '../utils/sendEmail'; // הנתיב לקובץ שלך
const router = express.Router();

router.post('/share-cart', async (req, res) => {
  const { email, cart } = req.body;

  if (!email || !Array.isArray(cart)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const content = cart.map(item => `• ${item.product.ProductName} – ${item.product.price} ₪`).join('<br>');

  await sendEmail(email, `<b>סל קניות ששותף איתך:</b><br>${content}`);
  res.status(200).json({ success: true });
});

export default router;
