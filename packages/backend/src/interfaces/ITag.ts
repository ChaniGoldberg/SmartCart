import {Tag} from "@smartcart/shared/src/tag";

export interface ITag {

    getAllTags():Promise<Tag[]> ;
}