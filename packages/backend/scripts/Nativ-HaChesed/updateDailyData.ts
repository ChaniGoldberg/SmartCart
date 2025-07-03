import path from 'path';
import { Item } from "@smartcart/shared/src/item";
import { Store } from '@smartcart/shared/src/store';
import cron from 'node-cron';
import * as cheerio from 'cheerio';
import { Promotion } from '@smartcart/shared/src/promotion';
import { GOV_URLS } from '../../url';
import {convertStoreXmlToStoreJson} from './parseXmlToJson';
import { getMostUpdatePromoFile } from './promotions-netiv-hachesed';
import { convertXMLPromotionStringToFilteredJson } from './parseXMLPromosFullToJson';
import { getLatestUpdatePriceFullFile } from './latestPrices';
import {convertXMLPriceFullStringToFilteredJson} from './parseXmlFullPrice';


async function getFileNamesFromSite(url: string): Promise<string[]> {
    try {
        const html = await fetchContentFromUrl(url);
        const $ = cheerio.load(html);
        const fileNames: string[] = [];
        $('a').each((_, el) => {
            const href = $(el).attr('href');
            if (href && href.match(/\.(xml|zip|json|txt)$/i)) {
                fileNames.push(path.basename(href));
            }
        });
        return fileNames;
    } catch (error: any) {
        console.error("שגיאה בקבלת שמות קבצים מהאתר:", error);
        throw error;
    }
}

async function fetchContentFromUrl(url: string): Promise<string> {
    try {
        console.log(`מנסה להביא תוכן מ: ${url}`);
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36"
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`שגיאת HTTP! סטטוס: ${response.status} מ- ${url}. גוף התגובה: ${errorText}`);
        }
        return await response.text();
    } catch (error: any) {
        console.error(`שגיאה בהבאת נתונים מ- ${url}:`, error);
        throw error;
    }
}

export async function updateDailyData(): Promise<void> {
    console.log("מתחיל עדכון נתונים יומי עבור נתיב החסד...");
    try {
        console.log(`שלב 1: מביא את כל שמות הקבצים מ- ${GOV_URLS.natibHachesed}`);
        const allFileNames: string[] = await getFileNamesFromSite(GOV_URLS.natibHachesed);
        console.log(`נמצאו ${allFileNames.length} קבצים פוטנציאליים.`);

        let allStoresData: Store[] = [];
        let allPromotionsData: Promotion[] = [];
        let allItemsData: Item[] = []; 

        console.log("שלב 2: מעבד נתוני חנויות...");
        const storeFileName: string | undefined = allFileNames.find(name =>
            name.toLowerCase().includes('stores.xml') ||
            name.toLowerCase().includes('storefull.xml')
        );

        if (storeFileName) {
            try {
                const storeXmlUrl: string = new URL(storeFileName, GOV_URLS.natibHachesed).href;
                console.log(`מביא XML של חנויות מ: ${storeXmlUrl}`);
                const storeXmlContent: string = await fetchContentFromUrl(storeXmlUrl);
                const storesResult: Store[] | undefined = await convertStoreXmlToStoreJson(storeXmlContent);

                if (Array.isArray(storesResult)) {
                    allStoresData = storesResult;
                    console.log(`נותחו בהצלחה ${storesResult.length} חנויות.`);
                } else {
                    console.error("שגיאה בהמרת XML של חנויות ל-JSON:", storesResult); 
                }
            } catch (storeError: any) {
                console.error(`שגיאה בעיבוד נתוני חנויות מ- ${storeFileName}:`, storeError);
            }
        } else {
            console.warn("לא נמצא 'Stores.xml' או 'StoreFull.xml' בין הקבצים הרשומים. נתוני החנויות לא יעודכנו.");
        }

        const uniqueBranchIds: string[] = [...new Set(allStoresData.map((store: any) => store.subChainId ? store.subChainId.toString() : store.storeId.toString()).filter(Boolean))];
        console.log(`זוהו ${uniqueBranchIds.length} מזהי סניפים ייחודיים להמשך עיבוד.`);


        console.log("שלב 3: מעבד נתוני מבצעים עבור כל סניף...");
        for (const branchId of uniqueBranchIds) {
            console.log(`  מחפש את המבצעים העדכניים ביותר עבור סניף: ${branchId}`);
            const promoFileName: string | null = getMostUpdatePromoFile(allFileNames, branchId);
            if (promoFileName) {
                try {
                    const promoXmlUrl: string = new URL(promoFileName, GOV_URLS.natibHachesed).href;
                    console.log(`  מביא XML של מבצעים מ: ${promoXmlUrl}`);
                    const promoXmlContent: string = await fetchContentFromUrl(promoXmlUrl);
                    const promotions: Promotion[] = await convertXMLPromotionStringToFilteredJson(promoXmlContent);
                    allPromotionsData.push(...promotions);
                    console.log(`  נוספו ${promotions.length} מבצעים עבור סניף ${branchId}.`);
                } catch (promoError: any) {
                    console.error(`  שגיאה בעיבוד מבצעים עבור סניף ${branchId} (${promoFileName}):`, promoError);
                }
            } else {
                console.log(`  לא נמצא קובץ מבצעים עבור סניף: ${branchId}.`);
            }
        }
        console.log(`סה"כ מבצעים שנאספו בכל הסניפים: ${allPromotionsData.length}`);

        console.log("שלב 4: מעבד נתוני מוצרים (PriceFull) עבור כל סניף...");
        for (const branchId of uniqueBranchIds) {
            console.log(`  מחפש את המוצרים העדכניים ביותר עבור סניף: ${branchId}`);
            const priceFileName: string | null = getLatestUpdatePriceFullFile(allFileNames, branchId);
            if (priceFileName) {
                try {
                    const priceXmlUrl: string = new URL(priceFileName, GOV_URLS.natibHachesed).href;
                    console.log(`  מביא XML של מוצרים מ: ${priceXmlUrl}`);
                    const priceXmlContent: string = await fetchContentFromUrl(priceXmlUrl);
                    const items: Item[] = await convertXMLPriceFullStringToFilteredJson(priceXmlContent); 
                    allItemsData.push(...items); 
                    console.log(`  נוספו ${items.length} מוצרים עבור סניף }.`);
                } catch (priceError: any) {
                    console.error(`  שגיאה בעיבוד מוצרים עבור סניף ${branchId} (${priceFileName}):`, priceError);
                }
            } else {
                console.log(`  לא נמצא קובץ מוצרים עבור סניף: ${branchId}.`);
            }
        }
        console.log(`סה"כ מוצרים שנאספו בכל הסניפים: ${allItemsData.length}`); 

        console.log("\nעדכון נתונים יומי עבור נתיב החסד הושלם בהצלחה!");

        console.log("\n--- סיכום נתונים שנאספו ---");
        console.log(`  סה"כ חנויות: ${allStoresData.length}`);
        console.log(`  סה"כ מבצעים: ${allPromotionsData.length}`);
        console.log(`  סה"כ מוצרים: ${allItemsData.length}`); 
        console.log("---------------------------------\n");

    } catch (mainError: any) {
        console.error("אירעה שגיאה בלתי מטופלת במהלך תהליך עדכון הנתונים היומי:", mainError);
    }
}


cron.schedule('0 8 * * *', () => {
    console.log('📅 מריץ את פונקציית עדכון הנתונים היומית כעת (תוזמן על ידי cron)...');
    updateDailyData();
});

console.log("Natib HaChesed Daily Data Updater פועל ומתוזמן להתעדכן כל יום בשעה 08:00 בבוקר.");
console.log("זכור להחליף את ה-URL השומר מקום ב-GOV_URLS.natibHachesed ב-URL האמיתי.");