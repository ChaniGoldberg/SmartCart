import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "openai";
import { logToFile } from "./logger";
import fetch from 'node-fetch';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const GPT_MODE = process.env.GPT_MODE || "mock";
const MOCK_URL = process.env.MOCK_GPT_URL || "";

function buildPrompt(tags: string[], products: string[], instructions: string): string {
    return `
### Instructions:
${instructions}

### Tag List:
${tags.join(", ")}

### Product List:
${products.map((p, i) => `${i + 1}. ${p}`).join(", ")}
`;
}

async function sendTaggingRequest(payload: any): Promise<string> {
    logToFile(`[sendTaggingRequest] GPT_MODE: ${GPT_MODE}`);

    if (GPT_MODE === "real") {
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are helping to tag products by categories." },
                    { role: "user", content: payload.prompt },
                ],
                temperature: 0.2,
            });
            const content = completion.choices[0].message.content || "";
            return content;
        } catch (error) {
            logToFile(`[sendTaggingRequest] Error with OpenAI API: ${error}`);
            throw error;
        }
    } else {
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
                const errMsg = `Mock service failed: ${response.status} ${response.statusText}`;
                logToFile(errMsg);
                throw new Error(errMsg);
            }

            const text = await response.text();
            return text;
        } catch (error) {
            logToFile(`[sendTaggingRequest] Error with mock service: ${error}`);
            throw error;
        }
    }
}

export default async function tagProductsByGPT(productNames: string[], tagNames: string[], instructions: string): Promise<string> {
    logToFile("[tagProductsByGPT] Starting product tagging with GPT");

    const prompt = buildPrompt(tagNames, productNames, instructions);
    const payload = GPT_MODE === "real"
        ? { prompt }
        : { products: productNames, tags: tagNames, prompt };

    try {
        const result = await sendTaggingRequest(payload);
        logToFile("[tagProductsByGPT] Tagging completed successfully.");
        return result;
    } catch (error) {
        logToFile(`[tagProductsByGPT] Tagging process failed: ${error}`);
        return "";
    }
}
