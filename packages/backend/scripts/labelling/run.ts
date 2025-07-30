import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(__dirname, '../../.env') });

import { labelItemsWithAI } from "./laballingFullScript";
import { logToFile } from './logger';

/**
 * Run the full product labelling process
 */
export async function runLabellingProcess() {
  try {
    logToFile("Starting labelling process...");

    const result = await labelItemsWithAI();

    logToFile("Labelling process completed successfully.");
    logToFile(`Labelling result:\n${result}`);
  } catch (error: any) {
    logToFile(`Error during labelling process: ${error.message || error}`);
  }
}

// Run directly if file is executed
runLabellingProcess();
