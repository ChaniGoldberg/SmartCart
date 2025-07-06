import { Tag } from "@smartcart/shared/src/tag";
import { tagService } from "../../injection.config";


export async function searchTagsByText(tagName: string): Promise<Tag[] | null> {
    const tags:Tag[]|null= await tagService.getAllTags();
    if (!tags || !Array.isArray(tags)) {
        return null;
    }
    const matchingTags: Tag[] = tags
        .filter(tag => tag && typeof tag.tagName === "string" && tag.tagName.toLowerCase().includes(tagName.toLowerCase()));
    if (matchingTags.length === 0) {
        return null;
    }
    return matchingTags;
}