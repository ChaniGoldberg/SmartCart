import { ITag } from '../interfaces/ITag';
import { Tag } from '@smartcart/shared/src/tags';
import { db } from "../db/dbProvider";

export class TagService implements ITag {
    private db: typeof db;

    constructor() {
        this.db = db;
    }

    async getAllTags(): Promise<Tag[]> {
        throw new Error('getAllTags method not implemented yet');
    }

    async addTag(tagName: string): Promise<Tag> {
        try {
            const existingTag = this.db.Tag.find(t => t.tagName === tagName);
            if (existingTag) {
                return existingTag;
            }

            const newTag: Tag = {
                tagId: this.db.Tag.length + 1,
                tagName,
                dateAdded: new Date(),
                isAlreadyScanned: false
            };

            // TODO: Call function to scan the tags
            // if() {
            //   newTag.isAlreadyScanned = true;
            // }

            this.db.Tag.push(newTag);
            return newTag;
        } catch (error) {
            console.error('Error adding tag:', error);
            throw error;
        }
    }
}

export const tagService = new TagService();
