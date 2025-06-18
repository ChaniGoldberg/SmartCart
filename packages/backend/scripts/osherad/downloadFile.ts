import * as fs from 'fs';
import fetch from 'node-fetch';
/**
 * מוריד קובץ מהכתובת שנשלחת לפונקציה ושומר אותו לנתיב מקומי
 * @param fileUrl כתובת הקובץ להורדה
 * @param outputPath הנתיב המקומי לשמירה
 */
 async function downloadFile(fileUrl: string, outputPath: string) {
    const response = await fetch(fileUrl);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    if (!response.body) {
        throw new Error('Response body is null');
    }
    const fileStream = fs.createWriteStream(outputPath);
    return new Promise<void>((resolve, reject) => {
        response.body!.pipe(fileStream);
        response.body!.on('error', reject);
        fileStream.on('finish', resolve);
    });
}
export default downloadFile
 