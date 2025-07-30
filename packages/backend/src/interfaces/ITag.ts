
import { Tag } from "@smartcart/shared"
export interface ITag {

    getAllTags(): Promise<Tag[] | null>

    addTag(tagName: string): Promise<Tag>
}
