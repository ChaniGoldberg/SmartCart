import path from 'path';
import fs from 'fs/promises';

const folderPath = path.join('C:/Users/Lenovo/Desktop/SmartCartHelp/RamiLeviFiles');

export async function getLatestFile(storeId: string): Promise<string | null> {
  const allFiles = await fs.readdir(folderPath);

  // סינון לפי מזהה הסניף
  const storeFiles = allFiles.filter(file => {
    return file.startsWith("PriceFull7290058140886") && file.includes(`-${storeId}-`);
  });

  if (storeFiles.length === 0) return null;

  // מיון פשוט לפי שם הקובץ כולו (ללא עיבוד תאריכים)
  storeFiles.sort();
  return storeFiles[storeFiles.length - 1];
}
