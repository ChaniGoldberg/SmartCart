import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";
import { Tag } from "@smartcart/shared/src/tag";
import { Item } from "@smartcart/shared/src/item";
import { logToFile } from "./logger";
import fetch from 'node-fetch';
import { log } from "console";


// פונקציה להוספת שורות ללוג בקובץ


// ע"י שימוש ב- util.format נשמור פורמט דומה ל-console.logToFile


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

//const tagsData: Tag[] = require('../../mockData/tags.json') as Tag[];

const GPT_MODE = process.env.GPT_MODE || "mock"; // "real" או "mock"
const MOCK_URL = process.env.MOCK_GPT_URL || "";

function buildPrompt(tags: string[], products: string[], instructions: string): string {
    logToFile("[buildPrompt] בניית פרומפט ל-GPT");
  //  logToFile(`[buildPrompt] הוראות: ${instructions}`);
  //  logToFile(`[buildPrompt] רשימת תיוגים (${tags.length}): ${tags.join(", ")}`);
  //  logToFile(`[buildPrompt] רשימת מוצרים (${products.length}):\n${products.map((p, i) => `${i + 1}. ${p}`).join(", ")}`);
    const prompt = `
### הוראות:
${instructions}

### רשימת תיוגים:
${tags.join(", ")}

### רשימת מוצרים:
${products.map((p, i) => `${i + 1}. ${p}`).join(", ")}
`;
   // logToFile("[buildPrompt] פרומפט שנוצר:\n" + prompt);
    return prompt;
}

async function sendTaggingRequest(payload :any): Promise<string> {
    logToFile(`[sendTaggingRequest] מצב GPT_MODE: ${GPT_MODE}💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🧡🧡🧡💚💚💚💚💚💚💚💚💚`);
    logToFile(`[sendTaggingRequest] payload שנשלח:\n${JSON.stringify(payload, null, 2)}💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🧡🧡🧡💚💚💚💚💚💚💚💚💚`);

    if (GPT_MODE === "real") {
        logToFile("📡 שולח בקשה אמיתית ל-OpenAI...💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🖤🖤🧡🧡🧡💚💚💚💚💚💚💚💚💚");
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "אתה מסייע בתיוג מוצרים על פי קטגוריות" },
                    { role: "user", content: payload.prompt },
                ],
                temperature: 0.2,
            });
            const content = completion.choices[0].message.content || "";
            logToFile("✅ קיבל תגובה מ-OpenAI:💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🖤🖤🧡🧡🧡💚💚💚💚💚💚💚💚💚");
            logToFile(content);
            return content;
        } catch (error) {
            log("❌ שגיאה בקריאה ל-OpenAI:", error);
            throw error;
        }
    } else {
        logToFile("🧪 משתמש בשירות GPT מדומה (mock)...💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🩶🩶🧡🧡🧡💚💚💚💚💚💚💚💚💚");
        try {
            const mockPayload = {
            products: payload.products,
            tags: payload.tags
        };
            const response = await fetch(MOCK_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mockPayload),
            });
            if (!response.ok) {
                const errMsg = `❌ שירות Mock נכשל: ${response.status} ${response.statusText}`;
                logToFile(`errMsg: ${errMsg}💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🩶🩶🧡🧡🧡💚💚💚💚💚💚💚💚💚`);
                throw new Error(errMsg);
            }
            const text = await response.text();
            logToFile("✅ קיבל תגובה משירות Mock:💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🩶🩶🧡🧡🧡💚💚💚💚💚💚💚💚💚");
            logToFile(`${text}💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🩶🩶🧡🧡🧡💚💚💚💚💚💚💚💚💚`);
            return text;
        } catch (error) {
            log("❌ שגיאה בשימוש בשירות Mock:💚💚💚💚💚💚💚💚💚🫀🧡🧡🧡🩶🩶🧡🧡🧡💚💚💚💚💚💚💚💚💚", error);
            throw error;
        }
    }
}

export default async function tagProductsByGPT(items: Item[], tags: Tag[], instructions: string): Promise<string> {
    logToFile("🚀 [tagProductsByGPT] התחלת תהליך תיוג מוצרים בעזרת GPT💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚");

    logToFile(`[tagProductsByGPT] סך המוצרים לקבלה: ${items.length}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
    //logToFile(`[tagProductsByGPT] רשימת שמות מוצרים:💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚\n${products.map(p => p.itemName).join(", ")}`);

    logToFile(`[tagProductsByGPT] סך התגיות לקבלה: ${tags.length}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
    // logToFile(`[tagProductsByGPT] רשימת שמות תגיות:💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚\n${tags.map(t=>t.tagName)}`);

    const tagNames = tags.map(t => t?.tagName).filter(Boolean);//ממפה את שמות התגיות הקיימות ללא Undifined, Null
    //logToFile(`tagNames : ${tagNames}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
    const productNames = items.map(p => p.itemName);//ממפה את שמות המוצרים
    //logToFile(`productNames : ${productNames}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
    // מבנה ה-payload שונה בהתאם ל-GPT_MODE
    logToFile(`GPT_MODE : ${GPT_MODE}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
    const prompt = buildPrompt(tagNames, productNames, instructions)
    const payload = GPT_MODE === "real"
        ? { prompt: prompt }
        : { products: productNames, tags: tagNames };


    try {
        payload.prompt = prompt;
       // logToFile(` sendTaggingRequest(payload.products) : ${payload.products}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
      //  logToFile(` sendTaggingRequest(payload.prompt) : ${payload.prompt}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
      //  logToFile(` sendTaggingRequest(payload.tags) : ${payload.tags}💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚💚`);
        const result = await sendTaggingRequest(payload);
        logToFile("✅ [tagProductsByGPT] סיום תהליך עם תוצאה:");
        logToFile(`result from func sendTaggingRequest: ${result}`);
        return result;
    } catch (error) {
        log("❌ [tagProductsByGPT] שגיאה בתהליך תיוג המוצרים:", error);
        return "";
    }
}
