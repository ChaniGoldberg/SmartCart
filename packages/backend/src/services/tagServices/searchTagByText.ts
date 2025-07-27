import dotenv from 'dotenv';
dotenv.config();

import { Tag } from "@smartcart/shared";
import { tagService } from "../../injection.config";
import { TagRepository } from "../../db/Repositories/tagRepository";
import { supabase } from "../supabase";

export async function searchTagsByText(tagName: string): Promise<Tag[] | null> {
    const tagRepository: TagRepository = new TagRepository(supabase);
    if (!tagName || typeof tagName !== "string" || tagName.trim() === "") {
        return null;
    }
    const tags: Tag[] | null = await tagRepository.fuzzySearchTagsByName(tagName);    
    return tags;
}