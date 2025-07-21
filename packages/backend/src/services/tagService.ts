import { Tag } from '../../../shared/src/tag';
import { ITag } from '../interfaces/ITag';
import { TagRepository } from '../db/Repositories/tagRepository';
import { supabase } from './supabase';
import { ItemRepository } from '../db/Repositories/itemRepository';
export const tagRepository = new TagRepository(supabase);


const itemService = new ItemRepository(supabase);
export class TagService implements ITag {

    private tagRepository: TagRepository;

    constructor(tagRepository: TagRepository) {
        this.tagRepository = tagRepository;
    }

    async getAllTags(): Promise<Tag[] | null> {
        return this.tagRepository.getAllTags();
    }
    
    async addTag(tagName: string): Promise<Tag> {
        const existing = await this.tagRepository.getTagByName(tagName);
        if (existing) return existing;
        return this.tagRepository.addTag( tagName );

    }

    async getItemsWithoutTags(): Promise<any[]> {
       let  items=await itemService.getAllItems();
        if (!items) return [];
        // מחזיר את כל המוצרים שמערך התגים שלהם לא קיים או ריק
        return items.filter(item => !item.tagsId || item.tagsId.length === 0);
    }

    
}

export const tagService = new TagService(tagRepository);
