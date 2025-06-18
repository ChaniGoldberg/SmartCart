import { promises as fs } from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';

// פונקציה 1: ממירה XML לאובייקט JS
async function parseXmlFileToObject(xmlFilePath: string): Promise<any> {
  const xmlText = await fs.readFile(xmlFilePath, 'utf-8');
  return parseStringPromise(xmlText, {
    explicitArray: false,
    ignoreAttrs: false,
    trim: true,
    preserveChildrenOrder: true,
    mergeAttrs: true,
    explicitRoot: false
  });
}

// פונקציה 2: מסדרת את הנתונים למבנה שלך
function normalizeOsheradData(jsonData: any) {
  const subChainsRaw = jsonData.SubChains?.SubChain || [];
  const subChainsArr = Array.isArray(subChainsRaw) ? subChainsRaw : [subChainsRaw];

  const subChains = subChainsArr.map((sub: any) => {
    const storesRaw = sub.Stores?.Store || [];
    const storesArr = Array.isArray(storesRaw) ? storesRaw : [storesRaw];

    const stores = storesArr.map((store: any) => ({
      storeId: store.StoreId,
      chainId: jsonData.ChainId,
      subChainId: sub.SubChainId,
      storeName: store.StoreName,
      address: store.Address
    }));

    return {
      subChainId: sub.SubChainId,
      subChainName: sub.SubChainName,
      stores
    };
  });

  return {
    chainId: jsonData.ChainId,
    chainName: jsonData.ChainName,
    subChains
  };
}

// פונקציה ראשית שמחזירה את האובייקט בלבד
async function parseStoresXml() {
  try {
    const xmlFilePath = path.join(__dirname, 'Stores7290103152017-202506100805.xml');
    const jsonData = await parseXmlFileToObject(xmlFilePath);
    const result = normalizeOsheradData(jsonData);
    return result; // מחזיר את האובייקט, לא כותב לקובץ
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
}

export { parseStoresXml, parseXmlFileToObject, normalizeOsheradData };
