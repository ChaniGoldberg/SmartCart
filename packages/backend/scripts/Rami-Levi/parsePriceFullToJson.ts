import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { Price } from '@smartcart/shared/src/prices';

// Envelope function that gets xmlFilePath and returns Item[]
export async function parseXMLFileToJson(xmlFilePath: string): Promise<Price[]> {
  const jsonData = await readAndParseXmlFile(xmlFilePath);
  return extractItemsFromXml(jsonData);
}

// Reads and parses the XML file
export async function readAndParseXmlFile(xmlFilePath: string): Promise<any> {
  const xmlData = await fs.readFile(xmlFilePath, "utf-8");
  return parseStringPromise(xmlData, { explicitArray: false });
}

// Extracts and maps items to Item[], including ChainId and StoreId from the root
export async function extractItemsFromXml(jsonData: any): Promise<Price[]> {
  // Extract ChainId and StoreId from the root of the XML
  const chainId = jsonData?.Root?.ChainId || "";
  const storeId = jsonData?.Root?.StoreId || "";

  // Get the raw items array (or single object)
  const itemsRaw = jsonData?.Root?.Items?.Item;
  if (!itemsRaw) {
    throw new Error("No items found in XML.");
  }


  const itemsArray = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];

  // Map each raw item to your Item interface, including ChainId and StoreId
  return itemsArray.map((item: any) => ({
    ChainId: chainId,
    StoreId: storeId,
    PriceUpdateDate: item.PriceUpdateDate ? new Date(item.PriceUpdateDate) : new Date(),
    ItemCode: item.ItemCode || "",
    ItemType: item.ItemType !== undefined ? Number(item.ItemType) : 0,
    ItemName: item.ItemName || "",
    ManufacturerName: item.ManufacturerName || "",
    ManufactureCountry: item.ManufactureCountry || "",
    ManufacturerItemDescription: item.ManufacturerItemDescription || "",
    UnitQty: item.UnitQty || "",
    Quantity: item.Quantity !== undefined ? Number(item.Quantity) : 0,
    UnitOfMeasure: item.UnitOfMeasure || "",
    bIsWeighted: item.bIsWeighted !== undefined ? Number(item.bIsWeighted) : 0,
    QtyInPackage: item.QtyInPackage || "",
    ItemPrice: item.ItemPrice !== undefined ? Number(item.ItemPrice) : 0,
    UnitOfMeasurePrice: item.UnitOfMeasurePrice !== undefined ? Number(item.UnitOfMeasurePrice) : 0,
    AllowDiscount: item.AllowDiscount !== undefined ? Number(item.AllowDiscount) : 0,
    ItemStatus: item.ItemStatus !== undefined ? Number(item.ItemStatus) : 0,
    ItemId: item.ItemId !== undefined ? Number(item.ItemId) : 0,
    CorrectItemName: "", 
    Category: "",
  }));
}

