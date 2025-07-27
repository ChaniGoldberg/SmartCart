import { Tag } from "@smartcart/shared";

export interface ITagRepository {
    addTag(tagName: string): Promise<Tag>
    addManyTags(tags: Tag[]): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<Tag>;
    updateManyTags(tags: Tag[]): Promise<Tag[]>;
    getAllTags(): Promise<Tag[]>;
    getTagById(tagId: number): Promise<Tag | null>;
    deleteTagById(tagId: number): Promise<void>;
    fuzzySearchTagsByName(tagName: string): Promise<Tag[]>;
    
}
