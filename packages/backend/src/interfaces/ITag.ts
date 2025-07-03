import { Tag } from "@smartcart/shared/src/tags"

export interface ITag {

    getAllTags(): Promise<Tag[]>
    addTag(tagName: string): Promise<Tag>

}