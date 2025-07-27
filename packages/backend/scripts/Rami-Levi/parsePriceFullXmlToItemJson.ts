import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { Item } from '@smartcart/shared/src/item'; // Make sure this import path is correct for your setup
export async function parsePriceFullXmlToItemJson(xmlFilePath: string): Promise<Item[]> {
  try {
    // Read the XML file as a string
    const xmlData = await fs.readFile(xmlFilePath, "utf-8");
    // Parse the XML string to a JS object
    const jsonData = await parseStringPromise(xmlData, { explicitArray: false });
    // Get the raw items array (or single object)
    const itemsRaw = jsonData?.Root?.Items?.Item;
    if (!itemsRaw) {
      throw new Error("No items found in XML.");
    }
    // Ensure itemsRaw is always an array
    const itemsArray = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];
    // Map each raw item to your Item interface
    const items: Item[] = itemsArray.map((item: any) => ({
      // PriceUpdateDate: item.PriceUpdateDate ? new Date(item.PriceUpdateDate) : new Date(),
      itemCode: item.ItemCode !== undefined ? String(item.ItemCode) : "",
      itemType: item.ItemType !== undefined ? Number(item.ItemType) : 0,
      itemName: item.ItemName || "",
      manufacturerName: item.ManufacturerName || "",
      manufactureCountry: item.ManufactureCountry || "",
      manufacturerItemDescription: item.ManufacturerItemDescription || "",
      // UnitQty: item.UnitQty || "",
      // Quantity: item.Quantity !== undefined ? Number(item.Quantity) : 0,
      // UnitOfMeasure: item.UnitOfMeasure || "",
      // bIsWeighted: item.bIsWeighted !== undefined ? Number(item.bIsWeighted) : 0,
      // QtyInPackage: item.QtyInPackage || "",
      // ItemPrice: item.ItemPrice !== undefined ? Number(item.ItemPrice) : 0,
      // UnitOfMeasurePrice: item.UnitOfMeasurePrice !== undefined ? Number(item.UnitOfMeasurePrice) : 0,
      // AllowDiscount: item.AllowDiscount !== undefined ? Number(item.AllowDiscount) : 0,
      itemStatus: item.ItemStatus === true,
      itemId: item.ItemId !== undefined ? Number(item.ItemId) : 0, // Uncomment if you add ItemId to the interface
      tagid: item.Tagid ? (Array.isArray(item.tagid) ? item.Tagid.map(Number) : [Number(item.Tagid)]) : [],
      correctItemName: item.CorrectItemName || ""
    }));
    return items;
  } catch (err) {
    console.error("Error parsing XML to JSON array:", err);
    throw err;
  }
}