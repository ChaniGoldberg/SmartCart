import { parseStoresXmlFileToStores } from "./parseXmlStoreToJson";
import fs from 'fs/promises';
import { Item } from '@smartcart/shared/src/item';
import getMostUpdate from "./getMostUpdate";
import { ReturnsTheMostUpToDatePromotionsFile } from "./LastFilePromotions";
import { Store } from "@smartcart/shared/src/store";
import { parseXmlPromotionsToJson, parseXmlToJson } from "./convertXMLPromotionFileToJson";
import cron from 'node-cron';
import getMostUpdateStoresFile from "./getMostUpdateStoresFile";
import * as path from "path";
import { Client } from "basic-ftp";
import { connectAndListFiles } from "./connect-rami-levi"; // שנה נתיב לפי הצורך
import { downloadFileWithZip } from "./downloadFile";
import { createClient } from "@supabase/supabase-js";
import { parsePriceFullXmlToItemJson } from "./parsePriceFullXmlToItemJson";
import { Price } from "@smartcart/shared/src/price";
import { parsePriceFullXmlToPriceJson } from "./parsePriceFullXmlToPriceJson";
import { Promotion } from "@smartcart/shared/src/promotion";
export async function getFileNames(): Promise<{ client: Client; fileNames: string[] }> {
    const { client, files } = await connectAndListFiles();
    // אל תסגור כאן!
    const fileNames = files.filter(f => f.isFile).map(f => f.name);
    return { client, fileNames };
}
export async function downloadFile(client: Client, fileName: string, localDir: string): Promise<void> {
    // console.log(client);
    // console.log(localDir);
    // console.log(fileName);
    const localPath = path.join(localDir, fileName);
    // console.log(`Downloading ${fileName} to ${localPath}...`);
    await client.downloadTo(localPath, fileName);
    // console.log("Download complete.");
}
export async function updateDailyForData() {
    let supabase: any = ""
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY; // או אנונימי לצורך בדיקות
    if (supabaseUrl && supabaseKey) {
        supabase = createClient(supabaseUrl, supabaseKey);
    }
    // const storeRepo = new StoreRepository(supabase);
    let fileStoreName = ""
    try {
        // console.log("after the function");
        let { client, fileNames } = await getFileNames()//שליפת כל שמות הקבצים לתוך מערך}
        // console.log("after the function getFiles name");
        const ddd = await getMostUpdateStoresFile(fileNames)
        if (ddd) { fileStoreName = ddd }
        const localDir = "C:/Users/odaya/Desktop/New folder/פרקטיקום/Project Smartcard/smartcart/packages/backend/scripts/Rami-Levi/DownloadsAllFile";
        //מציאת הקובץ של החנויות המעודכן ביותר
        await downloadFile(client, fileStoreName, localDir)//הורדת הקובץ המעודכן של החנויות
        const fileTParse = await fs.readdir(localDir);
        // console.log(fileTParse[0] + "file parse");
        // const fullPath = path.join(localDir, fileTParse[0]);
        // const content = await fs.readFile(fullPath, 'utf8');//קריאה מהקובת
        // console.log(localDir + '/' + fileTParse[0] + "jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
        const parseAllChain = await parseStoresXmlFileToStores(localDir + '/' + fileTParse[0]);//שליחתת כל התוכן לפנוקמיה הממירה לאוביקט את קובץ החנויות לאובייקטים של סניפים
        // console.log("tergyf uergbohbviorb irebtgrigtb");
        //    if (parseAllChain) {
        //     await storeRepo.addManyStores(parseAllChain);
        //      }
        console.log(JSON.stringify(parseAllChain, null, 2));
        const folderPathForPriceFIleXml = "C:/Users/odaya/Desktop/New folder/פרקטיקום/Project Smartcard/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPriceFilesForRamiLevy";
        const folderPathForPromotionFIleXml = "C:/Users/odaya/Desktop/New folder/פרקטיקום/Project Smartcard/smartcart/packages/backend/scripts/Rami-Levi/UpdatedPromotionFilesForRamiLevi";
        if (parseAllChain) {//אם הוא לא ריק
            console.log("hffffffffffffffffffffffffffffffffffffffffffffffffffffffffhhhhhhhhhhhhhhhhhhhhhhhhhhhhvvvvvvvvvvv");
            let allChain: Store[] = parseAllChain//בניית עצם מסוג סניף שיחזיק את מה שחזר מפונקצית ההמרה
            let allPriceFullForChain: string[] = []
            let allPromotionForChain: string[] = []
            let dictionaryPrices = new Map<string, Price[]>();
            let dictionaryItem = new Map<string, Item[]>();
            let dictionaryPromotion=new Map<string,Promotion[]>()
            let storeID2 = ""
            let storeID1 = ""
            //for (let i of allChain) {//עובר על כל הסניפים ועבור כל סניף מחזיר את הקובץ מחירים העדכני
                //console.log("hadassa and hodaya!!!!!!!!!!!!!!!!!!!");
                if (allChain[0].storeId < 10) {
                    storeID2 = "00" + String(allChain[0].storeId)
                }
                else if (allChain[0].storeId > 10 && allChain[0].storeId < 100) {
                    storeID2 = "0" + String(allChain[0].storeId)
                }
                else {
                    storeID2 = String(allChain[0].storeId)
                }

                const result = await getMostUpdate(fileNames, storeID2);
                if (result) {
                    allPriceFullForChain.push(result)
                }
                console.log(result);
                console.log("yyyyyyyyyyyyyyyyyyyy");
           // }// הורדת כל הקבצים המוחזקים במערך
            console.log(allPriceFullForChain);
            for (let i of allPriceFullForChain) {
                await downloadFileWithZip(client, i, folderPathForPriceFIleXml)
            }
            // console.log("finishhhhhhhhhhhhhhhhh to downloadddddddddddddd");
           // for (let i of allChain) {//עובר על כל הסניפים ועבור כל סניף מחזיר את הקובץ מבצעים העדכני
                // console.log("ttttttttttttttttttttttttt enter the for");
                if (allChain[0].storeId < 10) {
                    storeID1 = "00" + String(allChain[0].storeId)
                }
                else if (allChain[0].storeId > 10 && allChain[0].storeId < 100) {
                    storeID1 = "0" + String(allChain[0].storeId)
                }
                else {
                    storeID1 = String(allChain[0].storeId)
                }




                const result2 = await ReturnsTheMostUpToDatePromotionsFile(fileNames, storeID1);
                if (result2) {
                    allPromotionForChain.push(result2)
                }
            //}
            for (let i of allPromotionForChain) {
                await downloadFileWithZip(client, i, folderPathForPromotionFIleXml)
            }
            const filePriceNames = await fs.readdir(folderPathForPriceFIleXml);
            // console.log(filePriceNames);
            for (const fileName of filePriceNames) {
                // console.log("i am in the for of filepricenames");
                const filePath = path.join(folderPathForPriceFIleXml, fileName);
                dictionaryItem.set(fileName, await parsePriceFullXmlToItemJson(filePath))
                dictionaryPrices.set(fileName, await parsePriceFullXmlToPriceJson(filePath))
            }
            const filePromotionNames = await fs.readdir(folderPathForPromotionFIleXml);
            // console.log(filePromotionNames);
            for (const fileName of filePromotionNames) {
                // console.log("i am in the second for");
                const filePath = path.join(folderPathForPromotionFIleXml, fileName);
                // console.log(filePath);
                const buffer = await fs.readFile(filePath);
                const xmlText = buffer.toString('utf8');
                // console.log(xmlText);
                
                    dictionaryPromotion.set(fileName, await parseXmlPromotionsToJson(xmlText))
                    
                
            }
           console.log(dictionaryPrices);
          console.log(dictionaryPromotion);
           console.log(dictionaryItem);
           
          console.log("9999999999999");
          
            //    dictionaryPrice ,allPromotionForChain enter to the data base
        } else {
            console.error(":x: לא התקבל אובייקט תקין מה־XML");
        }
    }
    catch {
        console.log("the funcction dont success!!!!!!!!!!!!!!!!!!!");
    }
}
cron.schedule('0 8 * * *', () => {
    console.log(':date: מריץ את הפונקציה היומית שלך עכשיו');
    updateDailyForData();
});