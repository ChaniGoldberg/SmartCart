import { Request, Response } from "express";
import { Item } from "@smartcart/shared/src/item";
import { Price } from "@smartcart/shared/src/price";
import searchService from "../services/searchService";
import { ProductDTO } from "@smartcart/shared/src/dto/Product.dto";



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
const searchController = {

    searchPriceForStoreByItemTxtAndStorePK: async (req: Request, res: Response): Promise<any> => {
        const itemTxt = req.params.itemTxt;
        const storePK = req.params.storePK;

        if (!itemTxt || !storePK) {
            return res.status(400).json({ error: "Missing itemTxt or storePK" });
        }

        const itemPriceService = new searchService();
        try {
            const itemPrices = await itemPriceService.getItemsWithPrices(itemTxt);
            const filteredPrices = itemPrices.filter(itemPrice =>
                itemPrice.price?.store_pk === storePK
            );
            const Products: ProductDTO[] = filteredPrices.map(itemPrice => parseToProductDTO(itemPrice.item, itemPrice.price))
            res.json(Products);
        } catch (error: any) {
            console.error("Error getting prices:", error);
            res.status(error.status || 500).json({ error: error.message || "Unexpected error" });
        }

    }
}
export default searchController;