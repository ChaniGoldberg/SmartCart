import { Request, Response } from 'express';
import { IItemRepository } from "../db/IRepositories/IitemRepository";
import { supabase } from '../services/supabase';
import { ItemRepository } from '../db/Repositories/itemRepository';
import { TagRepository } from '../db/Repositories/tagRepository';
import { Item } from '@smartcart/shared/src/item';

export const itemfuzzySearch = async (req: Request, res: Response) => {
    const { itemText } = req.params;
    try {
        console.log("❤️"+itemText);        
        const itemRepo =new ItemRepository(supabase)
        const item:Item[] = await itemRepo.fuzzySearchItemsByText(itemText)
        console.log(item);        
        res.status(200).json({
            success: true,
            message: `The fuzzy Search with item: ${itemText} is successfully!`,
            timestamp: new Date().toISOString(),
            item
        });
    } catch (error) {
        res.status(500).json({ message: 'Search faile', error });
    }
}

export const tagsfuzzySearch = async (req: Request, res: Response) => {
    const { tagName } = req.params;
    try {
        const tagRepo=new TagRepository(supabase)
        const tags:any[] = await tagRepo.fuzzySearchTagsByName(tagName)
        console.log(tags);
        
        res.status(200).json({
            success: true,
            message: `The fuzzy Search with tag: ${tagName} is successfully!`,
            timestamp: new Date().toISOString(),
            tags
        });
    } catch (error) {
        res.status(500).json({ message: 'Search faile', error });
    }
}
