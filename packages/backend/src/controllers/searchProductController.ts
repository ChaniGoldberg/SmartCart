import { Request, Response } from "express";
import { Item } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { ProductDTO } from "@smartcart/shared";
import searchProductService from "../services/searchProductService";


const searchProductController = {
    searchPriceForStoresByItemTxtAndStorePKs: async (req: Request, res: Response): Promise<any> => {
        const itemTxt = req.params.itemTxt;
        const storePKs = req.body.storePKs;
        console.log("searchPriceForStoresByItemTxtAndStorePKs called with itemTxt:", itemTxt, "and storePKs:", storePKs);
        if (!itemTxt || !Array.isArray(storePKs) || storePKs.length === 0) {
            return res.status(400).json({ error: "Missing itemTxt or storePKs" });
        }
        const searchProductService1 = new searchProductService();
        try {
            const itemPrices = await searchProductService1.SearchItemsJoinPriceForStores(itemTxt, storePKs);
            if (!itemPrices) {
                return res.status(404).json({ error: "No items found" });
            }
            res.json(itemPrices);
        } catch (error: any) {
            console.error("Error getting prices:", error);
            res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
        }
    }
}

export default searchProductController;