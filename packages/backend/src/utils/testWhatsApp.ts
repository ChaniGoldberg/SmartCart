import { sendWhatsapp } from './sendWhatsApp';

async function main() {
  const to = '+972503905675'; // המספר שלך ששלח את ה-join
  const msg = 'בדיקת וואטסאפ עם Twilio ✔️';

  await sendWhatsapp(to, msg);
  console.log('🍀 Finished WhatsApp test!');
}

main();
