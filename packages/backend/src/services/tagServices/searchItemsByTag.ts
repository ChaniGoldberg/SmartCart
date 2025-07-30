import dotenv from 'dotenv';
dotenv.config();

import { Item } from "@smartcart/shared";
import { Tag } from "@smartcart/shared";
import { itemService } from "../../injection.config";
import { tagService } from "../../injection.config";
import { searchTagsByText } from "./searchTagByText";

export async function searchItemsByTag(tagName: string): Promise<Item[] | null> {
    // const tags: Tag[] | null = await tagService.getAllTags();
    const tags: Tag[] | null = await searchTagsByText(tagName);

    if (!tags || !Array.isArray(tags)) {
        return null;
    }
const matchingTagIds = new Set(
    tags
        .filter(tag => typeof tag.tagId === "number")
        .map(tag => tag.tagId)
);
    const items = await itemService.getAllItem();
    const filteredItems = items.filter(item =>
        Array.isArray(item.tagsId) &&
        item.tagsId.some(tagId => matchingTagIds.has(tagId))
    );
    return filteredItems;
}