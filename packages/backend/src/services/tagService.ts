
import { ITag } from '../interfaces/ITag';
import { Tag } from '../../../shared/src/tag';
import { db } from "../db/dbProvider";
import { ItemRepository } from '../db/Repositories/itemRepository';
import { supabase } from './supabase';

const itemService = new ItemRepository(supabase);
export class TagService implements ITag {
    private db: typeof db;

    constructor() {
        this.db = db;
    }

    async getAllTags(): Promise<Tag[]|null> {
        if(!this.db.Tag)
            return null;    
        return this.db.Tag;
    }

    
    async addTag(tagName: string): Promise<Tag> {
        try {
            const existingTag = this.db.Tag.find(t => t.tagName === tagName);
            if (existingTag) {
                return existingTag;
            }

            const newTag: Tag = {
                tagId: this.db.Tag.length + 1,
                tagName,
                dateAdded: new Date(),
                isAlreadyScanned: false
            };

            // TODO: Call function to scan the tags
            // if() {
            //   newTag.isAlreadyScanned = true;
            // }

            this.db.Tag.push(newTag);
            return newTag;
        } catch (error) {
            console.error('Error adding tag:', error);
            throw error;
        }
    }


    
    async getItemsWithoutTags(): Promise<any[]> {
       let  items=await itemService.getAllItems();
        if (!items) return [];
        // מחזיר את כל המוצרים שמערך התגים שלהם לא קיים או ריק
        return items.filter(item => !item.tagsId || item.tagsId.length === 0);
    }
}

export const tagService = new TagService();