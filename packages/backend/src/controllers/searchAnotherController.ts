import { Request, Response } from "express";
import { Item } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import searchService from "../services/searchService";
import { ProductDTO } from "@smartcart/shared";

export const parseToProductDTO = (item: Item, price: any | null) => {
    return {
        itemCode: item.itemCode,
        priceId: price?.price || 0,
        ProductName: item.itemName,
        storePK: price?.storePK || "",
        itemName: item.itemName,
        itemStatus: item.itemStatus,
        manufacturerItemDescription: item.manufacturerItemDescription,
        manufacturerName: item.manufacturerName,
        price: price?.price || 0,
        unitOfMeasurePrice: price?.unitOfMeasurePrice || 0,
        quantityInPackage: price?.quantityInPackage || 1
    }
}

const searchAnotherController = {
    searchPriceForStoresByItemTxtAndStorePKs: async (req: Request, res: Response): Promise<any> => {
        const itemTxt = req.params.itemTxt;
        const storePKs = req.body.storePKs; // Expecting an array of store PKs in the body
console.log("searchPriceForStoresByItemTxtAndStorePKs called with itemTxt:", itemTxt, "and storePKs:", storePKs);
        if (!itemTxt || !Array.isArray(storePKs) || storePKs.length === 0) {
            return res.status(400).json({ error: "Missing itemTxt or storePKs" });
        }

        const itemPriceService = new searchService();
        try {
            const itemPrices = await itemPriceService.getItemsWithPrices(itemTxt);
            const filteredPrices = itemPrices.filter(itemPrice =>
                storePKs.includes(itemPrice.price?.storePK) // Check if the price's store_pk is in the list of storePKs
            );
            const Products: ProductDTO[] = filteredPrices.map(itemPrice => parseToProductDTO(itemPrice.item, itemPrice.price));
            res.json(Products);
        } catch (error: any) {
            console.error("Error getting prices:", error);
            res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
        }
    }
}

export default searchAnotherController;