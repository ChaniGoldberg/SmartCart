import fs from 'fs';
import path from 'path';

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const logFilePath = path.join(logsDir, 'process.log');

export function logToFile(message: string) {
  const timeStampedMessage = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFileSync(logFilePath, timeStampedMessage, 'utf8');
}
