import { Request, Response } from "express";
import { itemService } from "../injection.config";
import { Item } from "@smartcart/shared/src/item";

export const deleteTagFromItem = async (req: Request, res: Response) => {
    try {
        const { item, tagId } = req.body; // item הוא אובייקט מלא
        if (!item) {
            return res.status(400).json({ message: "Item object is required" });
        }
        await itemService.deleteTagIdFromItemAndUpdate(item, tagId);
        res.status(200).json({ message: "Tag deleted from item" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};