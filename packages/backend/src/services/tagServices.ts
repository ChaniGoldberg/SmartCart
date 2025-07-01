import { ITag } from '../interfaces/ITag';
import { Tag } from '@smartcart/shared/src/tags';
import { db } from "../db/dbProvider";

export class TagService implements ITag {
    private db: typeof db;

    constructor() {
        this.db = db;
    }

    async getAllTags(): Promise<Tag[]> {
    // TODO: 
    throw new Error('getAllTags method not implemented yet');
}

    async addTag(tagName: string): Promise<Tag> {
        try {
            // בדיקה אם תגית עם השם הזה כבר קיימת
            const existingTag = this.db.Tag.find(t => t.tagName === tagName);
            if (existingTag) {
                // אם כבר קיימת, מחזירים אותה בלי להוסיף חדשה
                return existingTag;
            }

            const newTag: Tag = {
                tagId: this.db.Tag.length + 1,
                tagName,
                dateAdded: new Date(),
                isAlreadyScanned: false
            };

            //TODO
            //need here to call func that scan the tags
            //if(){
            //   newTag.isAlreadyScanned = true
            //}

            this.db.Tag.push(newTag);
            return newTag;
        } catch (error) {
            console.error('Error adding tag:', error);
            throw error;
        }
    }
}

