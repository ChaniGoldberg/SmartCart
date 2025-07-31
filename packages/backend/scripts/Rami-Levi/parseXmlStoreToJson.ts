import { Store } from "@smartcart/shared";
import { parseStringPromise } from "xml2js";
import * as fs from "fs/promises";
import * as iconv from "iconv-lite";


// פונקציה עיקרית: קוראת קובץ XML ומחזירה מערך של סניפים
export async function parseStoresXmlFileToStores(xmlFilePath: string): Promise<Store[] | undefined> {
  try {

    const jsonData = await readAndParseXmlFile(xmlFilePath);
    return extractStoresFromXmlToStore(jsonData);
  } catch {
    console.log("dont success the function parseStoresXmlFileToStores");

  }

}

// קריאת ופריסת קובץ XML


export async function readAndParseXmlFile(xmlFilePath: string): Promise<any> {
  try {
    // קריאה של הקובץ כ-Buffer, בלי לציין קידוד
    const fileBuffer = await fs.readFile(xmlFilePath);

    // המרה מ-UTF-16 LE ל-UTF-8 (טקסט)
    const decodedText = iconv.decode(fileBuffer, "utf16-le");

    // המרת טקסט JSON בעזרת xml2js
    const result = await parseStringPromise(decodedText, {
      explicitArray: false,
      ignoreAttrs: false,
      trim: true,
      mergeAttrs: true,
      explicitRoot: false
    });

    return result;
  } catch (err) {
    console.error("❌ שגיאה בפריסת קובץ XML:", err);
    throw err;
  }
}

// מיפוי JSON ל-Store[]
export function extractStoresFromXmlToStore(jsonData: any): Store[] {
  console.log("in the 3 function!!!!!!!!!!!!!!!");

  const chainId = jsonData?.ChainID ?? "";
  const chainName = jsonData?.ChainName ?? "";

  const subChain = jsonData?.SubChains?.SubChain;
  const subChainId = Number(subChain?.SubChainID ?? 0);
  const subChainName = subChain?.SubChainName ?? "";

  const storesRaw = subChain?.Stores?.Store || [];
  const storesArray = Array.isArray(storesRaw) ? storesRaw : [storesRaw];

  return storesArray.map((store: any): Store => ({
    storePK: `${chainId}-${subChainId}-${store.StoreID}`,
    storeId: Number(store.StoreID ?? 0),
    chainId,
    subChainId,
    chainName,            // <-- הוסף פה את הערך
    subChainName,
    storeName: store.StoreName ?? "",
    address: store.Address ?? "",
    city: store.City ?? "",
    zipCode: store.ZipCode ?? ""
  }));
}