import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { Item } from '@smartcart/shared/src/items';

// Envelope function that gets xmlFilePath and returns Item[]
export async function parsePriceFullXMLFileToItem(xmlFilePath: string): Promise<Item[]> {
  const jsonData = await readAndParseXmlFile(xmlFilePath);
  return extractItemsFromXmlToItem(jsonData);
}

// Reads and parses the XML file
export async function readAndParseXmlFile(xmlFilePath: string): Promise<any> {
  const xmlData = await fs.readFile(xmlFilePath, "utf-8");
  return parseStringPromise(xmlData, { explicitArray: false });
}

export async function extractItemsFromXmlToItem(jsonData: any): Promise<Item[]> {
  // Get the raw items array (or single object)
  const itemsRaw = jsonData?.Root?.Items?.Item;
  if (!itemsRaw) {
    throw new Error("No items found in XML.");
  }

  const itemsArray = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

  // Map each raw item to your Item interface
  return itemsArray.map((item: any) => ({
    itemCode: item.ItemCode !== undefined ? Number(item.ItemCode) : 0,
    itemId: item.ItemId !== undefined ? Number(item.ItemId) : 0,
    itemType: item.ItemType !== undefined ? Number(item.ItemType) : 0,
    itemName: item.ItemName || "",
    correctItemName: "", // Fill as needed
    manufacturerName: item.ManufacturerName || "",
    manufactureCountry: item.ManufactureCountry || "",
    manufacturerItemDescription: item.ManufacturerItemDescription || "",
    itemStatus: item.ItemStatus !== undefined ? Boolean(Number(item.ItemStatus)) : false,
    tagsId: []
  }));
}




