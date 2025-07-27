import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";
import { Price } from "@smartcart/shared";
export async function parsePriceFullXmlToPriceJson(xmlFilePath: string): Promise<Price[]> {
    try {
        // Read the XML file as a string
        const xmlData = await fs.readFile(xmlFilePath, "utf-8");
        // Parse the XML string to a JS object
        const jsonData = await parseStringPromise(xmlData, { explicitArray: false });
        console.log("json data!!!!");
        
        console.log(jsonData);
        
        // Get the raw items array (or single object)
        const itemsRaw = jsonData?.Root?.Items?.Item;
       const chainId=jsonData?.Root?.ChainId
         const subChainId=jsonData?.Root?.SubChainId
           const storeId=jsonData?.Root?.StoreId
        if (!itemsRaw) {
            throw new Error("No items found in XML.");
        }
        // Ensure itemsRaw is always an array
        const itemsArray = Array.isArray(itemsRaw) ? itemsRaw : [itemsRaw];
        // Map each raw item to your Item interface
        const prices: Price[] = itemsArray.map((price: any) => ({
            storePK: `${chainId}-${subChainId}-${storeId}`,
            itemId: price.ItemId !== undefined ? Number(price.ItemId) : 0, // Uncomment if you add ItemId to the interface
            itemCode: price.ItemCode !== undefined ? String(price.ItemCode) : "",
            price: price.ItemPrice !== undefined ? Number(price.ItemPrice) : 0,
            priceUpdateDate: price.PriceUpdateDate ? new Date(price.PriceUpdateDate) : new Date(),
            unitQuantity: price.UnitQty || "",
            quantity: price.Quantity !== undefined ? Number(price.Quantity) : 0,
            unitOfMeasure: price.UnitOfMeasure || "",
            isWeighted: price.bIsWeighted !== undefined ? Boolean(Number(price.bIsWeighted)) : false,
            quantityInPackage: price.QtyInPackage !== undefined ? Number(price.QtyInPackage) : 0,
            unitOfMeasurePrice: price.UnitOfMeasurePrice !== undefined ? Number(price.UnitOfMeasurePrice) : 0,
            allowDiscount: price.AllowDiscount !== undefined ? Boolean(Number(price.AllowDiscount)) : false,

        }));
        console.log(prices);
        console.log("hdjkshiufhoerifnkf");
        
        
        return prices;
    } catch (err) {
        console.error("Error parsing XML to JSON array:", err);
        throw err;
    }
}