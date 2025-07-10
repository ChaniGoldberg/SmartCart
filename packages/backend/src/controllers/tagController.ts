import { Request, Response } from 'express';
import { tagService } from '../services/tagService';
import { itemService } from '../injection.config';
import { Item } from '@smartcart/shared/src/item';

// שליפת כל הטאגים
export async function getAllTags(req: Request, res: Response) {
  try {
    const tags = await tagService.getAllTags();
    if (!tags) {
      return res.status(404).json({ message: "No tags found" });
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
}

export const addTag = async (req: Request, res: Response) => {
    const { tagName } = req.params;
    try {
        const newTag = await tagService.addTag(tagName);
        res.status(201).json({
            success: true,
            message: `Tag ${tagName} added successfully!`,
            timestamp: new Date().toISOString(),
            tag: newTag // הוסף את התג שנוסף בתגובה
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding tag', error });
    }
};

export const addNewTagsToItems = async (req: Request, res: Response) => {
    const { tags, items } = req.body;
    const updatedItems: Item[] = [];
    try {
        for (const reqItem of items) {
            const item = await itemService.getItemById(reqItem.itemCode);
            if (item) {
                for (const tag of tags) {
                    if (!item.tagsId?.includes(tag.tagId)) {
                        item.tagsId?.push(tag.tagId);
                    }
                }
                await itemService.updateItem(item);
                updatedItems.push(item);
            }
        }
        res.status(200).json({
            success: true,
            message: 'Tags added to items successfully!',
            timestamp: new Date().toISOString(),
            items: updatedItems
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding tags to items', error });
    }
};