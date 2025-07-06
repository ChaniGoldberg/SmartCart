import { Item } from "@smartcart/shared/src/item";
import { Tag } from "@smartcart/shared/src/tag";
import { itemService } from "../../injection.config";
import { tagService } from "../../injection.config";

export async function searchItemsByTag(tagName : string): Promise<Item[] | null> {
    const tags:Tag[]|null= await tagService.getAllTags();
    if (!tags || !Array.isArray(tags)) {
        return null;
    }
    
    const matchingTagIds: number[] = tags
        .filter((tag: { tagName: string; }) => tag && typeof tag.tagName === "string" && tag.tagName.toLowerCase().includes(tagName.toLowerCase()))
        .map((tag: { tagId: any; }) => tag.tagId);
    const items = await itemService.getAllItem();
    const filteredItems = items.filter(item =>
        Array.isArray(item.tagsId) &&
        item.tagsId.some((tagId: number) => matchingTagIds.includes(tagId))
    );
    return filteredItems;
}


