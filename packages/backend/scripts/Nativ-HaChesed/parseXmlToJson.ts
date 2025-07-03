import { Store } from '@smartcart/shared/src/store';
import * as xml2js from "xml2js";


export async function convertStoreXmlToStoreJson(contentXML: string): Promise<Store[] | undefined> {
    if (!contentXML) {
        throw new Error('שגיאה: קלט XML לא מוגדר או ריק');
    }
    try {
        const dataJson = await xml2js.parseStringPromise(contentXML);
        // ודא ש-dataJson.root.chain הוא תמיד מערך
        const chainsArr = Array.isArray(dataJson.root.chain) ? dataJson.root.chain : [dataJson.root.chain];

        const allchains: Store[] = chainsArr.map((chainObj: any) => ({
            chainId: chainObj.chainId?.[0] ? parseInt(chainObj.chainId[0]) : 0, // המרה למספר
            // chainName: chainObj.chainName?.[0] ?? "",
            // subchains: chainObj.subchains?.[0]?.subchain?.map((subchainObj: any) => ({
            subChainId: chainObj.subChainId?.[0] ? parseInt(chainObj.subChainId[0]) : 0, // המרה למספר
            // subChainName: chainObj.subChainName?.[0] ?? "",
            // stores: chainObj.stores?.[0]?.store?.map((storeObj: any): Store => ({
            storeId: chainObj.storeId?.[0] ? parseInt(chainObj.storeId[0]) : 0, // המרה למספר
            chainName: chainObj.chainName?.[0] ?? "", // מגיע משרשרת האב
            // chainId: chainObj.chainId?.[0] ? parseInt(chainObj.chainId[0]) : 0, // מגיע משרשרת האב
            subChainName: chainObj.subChainName?.[0] ?? "", // מגיע מתת-שרשרת האב
            // subChainId: chainObj.subChainId?.[0] ? parseInt(chainObj.subChainId[0]) : 0, // מגיע מתת-שרשרת האב
            storeName: chainObj.storeName?.[0] ?? "",
            address: chainObj.address?.[0] ?? "",
            city: "", // לא זמין ב-XML זה
            zipCode: "", // לא זמין ב-XML זה
        })) || [];
        return allchains;
        // שטוח את המבנה המקונן כדי לקבל מערך יחיד של כל החנויות
        // const allStores: Store[] = allchains.flatMap((chain: any) =>
        //     chain.subchains.flatMap((subchain: any) => subchain.stores)
        // );
        // return allStores;
    }


    catch (error: any) {
        console.error("שגיאה בניתוח קובץ XML של חנויות:", error);
        throw new Error('שגיאה בניתוח קובץ XML: ' + error.message);
    }
}
