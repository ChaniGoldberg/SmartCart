import { Tag } from "../../../../shared/src/tag";

export interface ITagRepository {
    addTag(tag: Tag): Promise<Tag>;
    addManyTags(tags: Tag[]): Promise<Tag[]>;
    updateTag(tag: Tag): Promise<Tag>;
    updateManyTags(tags: Tag[]): Promise<Tag[]>;
    getAllTags(): Promise<Tag[]>;
    getTagById(tagId: number): Promise<Tag | null>;
    deleteTagById(tagId: number): Promise<void>;
    fuzzySearchTagsByName(tagName: string): Promise<Tag[]> ;
}
