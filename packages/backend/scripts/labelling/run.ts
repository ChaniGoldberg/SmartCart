import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, '../../.env') });
import { labelItemsWithAI } from "./laballingFullScript";
import { logToFile } from './logger';

/**
 * פונקציה שמריצה את תהליך התיוג המלא
 */
export async function runLabellingProcess() {
  try {
    console.log("Starting labelling process...💛💚🩵");
    logToFile("Starting labelling process...💛💚🩵");

    const result = await labelItemsWithAI();

    console.log("Labelling result:", result);
    logToFile(`Labelling result:\n${result}`);

    console.log("Labelling process completed successfully.");
    logToFile("Labelling process completed successfully.");
  } catch (error: any) {
    console.error("Error during labelling process:", error.message || error);
    logToFile(`Error during labelling process: ${error.message || error}`);
  }
}

// ניתן להריץ ישירות את הפונקציה
runLabellingProcess();
