import { updateDailyForData } from './updateDailyDataForRamiLevi';
import fs from 'fs';
import path from 'path';

// יצירת סטרים לכתיבה לקובץ טקסט
const logFilePath = path.join(__dirname, 'updateDailyOutput.txt');
const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });

// החלפת console.log כדי שהפלט ייכנס לקובץ
const originalLog = console.log;
const originalError = console.error;

console.log = (...args: any[]) => {
  logStream.write('[LOG] ' + args.join(' ') + '\n');
  originalLog(...args);
};

console.error = (...args: any[]) => {
  logStream.write('[ERROR] ' + args.join(' ') + '\n');
  originalError(...args);
};

// הפעלת הפונקציה
(async () => {
  console.log('🚀 התחלת הבדיקה של updateDailyForData');
  try {
    await updateDailyForData();
    console.log('✅ הפונקציה הסתיימה בהצלחה');
  } catch (err) {
    console.error('❌ שגיאה במהלך הרצת הפונקציה:', err);
  } finally {
    console.log('🛑 סיום הבדיקה');
    logStream.end();
  }
})();