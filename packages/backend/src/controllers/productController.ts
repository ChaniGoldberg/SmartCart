import { Request, Response } from "express";
import { ProductDTO } from "@smartcart/shared/src/dto/Product.dto";
import { ProductService } from "../services/productService";
import { Item } from "@smartcart/shared/src/item";
import { Price } from "@smartcart/shared/src/price";

export const parseToProductDTO = (item: Item, price: Price | null): ProductDTO => {
    return {
        itemCode: item.itemCode,
        priceId: price?.priceId || 0,
        ProductName: item.itemName,
        storePK: price?.storePK || "",
        itemName: item.itemName,
        itemStatus: item.itemStatus,
        manufacturerItemDescription: item.manufacturerItemDescription,
        manufacturerName: item.manufacturerName,
        price: price?.price || 0,
        unitOfMeasurePrice: price?.unitOfMeasurePrice || 0,
        quantityInPackage: price?.quantityInPackage || 1
    };
};

const productByCategoryController = {
    getProductsByCategoryAndStores: async (req: Request, res: Response): Promise<any> => {
        const { categoryName, storePKs } = req.body;
        console.log("🔍 בקשה למוצרים לפי קטגוריה:", categoryName, "חנויות:", storePKs);

        if (!categoryName || !Array.isArray(storePKs) || storePKs.length === 0) {
            return res.status(400).json({ error: "חובה לציין categoryName ורשימת storePKs" });
        }

        try {
            const service = new ProductService();
            const result = await service.getProductsByCategoryAndStores(categoryName, storePKs);

            const products: ProductDTO[] = result.map((entry: any) =>
                parseToProductDTO(entry.Item, entry)
            );

            res.json(products);
        } catch (error: any) {
            console.error("❌ שגיאה בשליפת מוצרים:", error);
            res.status(error.status || 500).json({ error: error.message || "שגיאה לא צפויה" });
        }
    }
};

export default productByCategoryController;
