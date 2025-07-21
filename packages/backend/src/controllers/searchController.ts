import { Request, Response } from "express";
import { Item } from "@smartcart/shared/src/item";
import { Price } from "@smartcart/shared/src/price";
import searchService from "../services/searchService";


export const parseToProductDTO = (item: Item, price: Price | null) => {
    return {
        productId: item.itemCode,
        ProductName: item.itemName,
        storePK: price?.storePK,
        itemName: item.itemName,
        itemStatus: item.itemStatus,
        price: price?.price,
    };
}
const searchController = {

    searchPriceForStoreByItemTxtAndStorePK :async (req: Request, res: Response) :Promise<any>=> {
        console .log("ss")
        console.log("searchPriceForStoreByItemTxtAndStorePK called with params:", req.params);
        const itemTxt = req.params.itemTxt;
        const storePK = req.params.storePK;

        if (!itemTxt || !storePK) {
            return res.status(400).json({ error: "Missing itemTxt or storePK" });
        }

        const itemPriceService = new searchService();
        try {
           const itemPrices = await itemPriceService.getItemsWithPrices(itemTxt);
            const filteredPrices = itemPrices.filter(itemPrice =>
                itemPrice.price?.storePK === storePK
            );
            const Products = filteredPrices.map(itemPrice => parseToProductDTO(itemPrice.item, itemPrice.price))
            res.json(Products);
        } catch (error: any) {
            console.error("Error getting prices:", error);
            res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
        }

   }
 }
export default searchController;