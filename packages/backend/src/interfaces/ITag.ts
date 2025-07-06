
import { Tag } from "@smartcart/shared/src/tag"

export interface ITag {

    getAllTags(): Promise<Tag[]| null>
    addTag(tagName: string): Promise<Tag>

}