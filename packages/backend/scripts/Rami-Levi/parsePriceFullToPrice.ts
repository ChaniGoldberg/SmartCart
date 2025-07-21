// import * as fs from "fs/promises";
// import { parseStringPromise } from "xml2js";
// import { Price } from '@smartcart/shared/src/price';

// // Envelope function that gets xmlFilePath and returns Price[]
// export async function parsePriceFullXMLFileToPrice(xmlFilePath: string): Promise<Price[]> {
//   const jsonData = await readAndParseXmlFile(xmlFilePath);
//   return extractItemsFromXmlToPrice(jsonData);
// }

// // Reads and parses the XML file
// export async function readAndParseXmlFile(xmlFilePath: string): Promise<any> {
//   const xmlData = await fs.readFile(xmlFilePath, "utf-8");
//   return parseStringPromise(xmlData, { explicitArray: false });
// }

// export async function extractItemsFromXmlToPrice(jsonData: any): Promise<Price[]> {
//   // Extract StoreId from the root of the XML
//   const storeId = jsonData?.Root?.StoreId !== undefined ? String(jsonData.Root.StoreId) : "";

//   // Get the raw items array (or single object)
//   const itemsRaw = jsonData?.Root?.Items?.Item;
//   if (!itemsRaw) {
//     throw new Error("No items found in XML.");
//   }

//   const itemsArray = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

//   // Map each raw item to your Price interface, using storeId from the root
//   return itemsArray.map((item: any, idx: number) => ({
//     priceId: 0,
//     storePK: storeId,
//     itemId: item.ItemId !== undefined ? Number(item.ItemId) : 0,
//     itemCode: item.ItemCode !== undefined ? String(item.ItemCode) : 0,
//     price: item.ItemPrice !== undefined ? Number(item.ItemPrice) : 0,
//     priceUpdateDate: item.PriceUpdateDate ? new Date(item.PriceUpdateDate) : new Date(),
//     unitQuantity: item.UnitQuantity || "",
//     quantity: item.Quantity !== undefined ? Number(item.Quantity) : 0,
//     unitOfMeasure: item.UnitOfMeasure || "",
//     isWeighted: item.IsWeighted !== undefined ? Boolean(Number(item.IsWeighted)) : false,
//     quantityInPackage: item.QuantityInPackage || "",
//     unitOfMeasurePrice: item.UnitOfMeasurePrice !== undefined ? Number(item.UnitOfMeasurePrice) : 0,
//     allowDiscount: item.AllowDiscount !== undefined ? Boolean(Number(item.AllowDiscount)) : false,
//   }));
// }