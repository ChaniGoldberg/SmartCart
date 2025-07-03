import { ITag } from "../interfaces/ITag";
import { Tag } from "@smartcart/shared/src/tag";
import {db} from "../db/dbProvider"

export class TagService implements ITag {
    db = db;
    private tags: Tag[] = [];

    async getAllTags(): Promise<Tag[]> {
        return db.Tag;
    }
}