import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";
import { Tag } from "@smartcart/shared/src/tag";
import { Item } from "@smartcart/shared/src/item";
import path from "path";


//dotenv.config({ path: path.join(__dirname, '../../.env') });

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const tagsData: Tag[] = require('../../mockData/tags.json') as Tag[];

const GPT_MODE = process.env.GPT_MODE || "mock"; // "real" או "mock"
const MOCK_URL = process.env.MOCK_GPT_URL || "";

function buildPrompt(tags: string[], products: string[], instructions: string): string {
    return `
### הוראות:
${instructions}

### רשימת תיוגים:
${tags.join(", ")}

### רשימת מוצרים:
${products.map((p, i) => `${i + 1}. ${p}`).join("\n")}
`;
}

async function sendTaggingRequest(payload: any): Promise<string> {
    if (GPT_MODE === "real") {
        // שליחה אמיתית ל-OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "אתה מסייע בתיוג מוצרים על פי קטגוריות" },
                { role: "user", content: payload.prompt },
            ],
            temperature: 0.2,
        });
        return completion.choices[0].message.content || "";
    } else {
        console.log("Using mock GPT service with payload:", payload);
        // שליחה ל-mock server
        const response = await fetch(MOCK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error(`Mock service failed: ${response.statusText}`);
        return await response.text();
    }
}

export default async function tagProductsByGPT(products: Item[], tags: Tag[], instructions: string): Promise<string> {
    const productNames = products.map(p => p.itemName);
    const tagNames = tags.map(t => t.tagName)
    // מבנה ה-payload שונה בהתאם ל-GPT_MODE
    const payload = GPT_MODE === "real"
        ? { prompt: buildPrompt(tagNames, productNames, instructions) }
        : { products: productNames, tags: tagNames };

    try {
        return await sendTaggingRequest(payload);
    } catch (error) {
        console.error("Error tagging products:", error);
        return "";
    }
}
