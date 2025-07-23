
import { SupabaseClient } from "@supabase/supabase-js";
import { ITagRepository } from "../IRepositories/ItagRepository";
import { Tag } from "../../../../shared/src/tag";

export class TagRepository implements ITagRepository {
    private readonly tableName = 'tag';
    private readonly itemTagsTableName = 'item_tags'; // <--- חדש: שם טבלת הקישור

    constructor(private supabase: SupabaseClient) { }

    private toDbTag(tag: any) {
        return {
            
            tag_name: tag.tagName,
            date_added: tag.dateAdded ? tag.dateAdded.toISOString() : null,
            is_already_scanned: tag.isAlreadyScanned,
        };
    }

    async fuzzySearchTagsByName(tagName: string): Promise<any[]> {
        if (this.supabase != null) {
            const { data, error } = await this.supabase.rpc('fuzzy_search_tags', { search_query: tagName });
            if (error) throw error;
            console.log('dataReturnd: ', data);
            return data;
        }
        return []; // Return an empty array if supabase is null
    }

    async addManyTags(tags: Tag[]): Promise<Tag[]> {
        if (tags.length === 0) {
            console.log('No tags to add.');
            return [];
        }

        try {
            console.log(`Adding ${tags.length} tags to Supabase via bulk insert`);
            const dbTags = tags.map(tag => this.toDbTag(tag));
            const { data, error } = await this.supabase
                .from(this.tableName)
                .insert(dbTags)
                .select('*');

            if (error) {
                console.error('Error inserting multiple tags:', error);
                throw new Error(`Failed to add multiple tags: ${error.message}`);
            }

            if (!data) {
                throw new Error('No data returned after adding multiple tags.');
            }

            console.log(`${data.length} tags added successfully.`);
            return tags;
        } catch (error: any) {
            console.error(`Error in addManyTags: ${error.message}`);
            throw error;
        }
    }

    async updateTag(tag: Tag): Promise<Tag> {
        try {
            console.log(`Updating tag: ${tag.tagName} (id: ${tag.tagId}) in Supabase`);
            const { data, error } = await this.supabase
                .from(this.tableName)
                .update(this.toDbTag(tag))
                .eq('tag_id', tag.tagId)
                .select('*');

            if (error) {
                console.error('Error updating tag:', error);
                throw new Error(`Failed to update tag: ${error.message}`);
            }

            if (!data || data.length === 0) {
                throw new Error('No data returned after updating tag.');
            }

            console.log('Tag updated successfully:', data[0]);
            return tag;
        } catch (error: any) {
            console.error(`Error in updateTag: ${error.message}`);
            throw error;
        }
    }

    async updateManyTags(tags: Tag[]): Promise<Tag[]> {
        if (tags.length === 0) {
            console.log('No tags to update.');
            return [];
        }

        try {
            console.log(`Updating ${tags.length} tags in Supabase`);
            const updatedTags: Tag[] = [];
            for (const tag of tags) {
                const { data, error } = await this.supabase
                    .from(this.tableName)
                    .update(this.toDbTag(tag))
                    .eq('tag_id', tag.tagId)
                    .select('*');

                if (error) {
                    console.error(`Error updating tag with id ${tag.tagId}:`, error);
                    throw new Error(`Failed to update tag with id ${tag.tagId}: ${error.message}`);
                }

                if (!data || data.length === 0) {
                    console.error(`No data returned after updating tag with id ${tag.tagId}.`);
                    continue;
                }
                updatedTags.push(tag);
            }
            console.log(`${updatedTags.length} tags updated successfully.`);
            return updatedTags;
        } catch (error: any) {
            console.error(`Error in updateManyTags: ${error.message}`);
            throw error;
        }
    }

    async getAllTags(): Promise<Tag[]> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*');

            if (error) {
                console.error('Error fetching all tags:', error);
                throw new Error(`Failed to fetch tags: ${error.message}`);
            }

            return (data || []).map(row => ({
                tagId: row.tag_id,
                tagName: row.tag_name,
                isAlreadyScanned: row.is_already_scanned,
            }));
        } catch (error: any) {
            console.error(`Error in getAllTags: ${error.message}`);
            throw error;
        }
    }


    async getTagById(tagId: number): Promise<Tag | null> {
        try {
            const { data, error } = await this.supabase
                .from(this.tableName)
                .select('*')
                .eq('tag_id', tagId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') {
                    return null;
                }
                console.error('Error fetching tag by id:', error);
                throw new Error(`Failed to fetch tag: ${error.message}`);
            }

            return data;
        } catch (error: any) {
            console.error(`Error in getTagById: ${error.message}`);
            throw error;
        }
    }

    async deleteTagById(tagId: number): Promise<void> {
        try {
            // לפני מחיקת התגית, מחק את כל הקישורים שלה מטבלת הקישור item_tags
            console.log(`Deleting all items linked to tag ${tagId} from ${this.itemTagsTableName}`);
            const { error: deleteLinksError } = await this.supabase
                .from(this.itemTagsTableName)
                .delete()
                .eq('tag_id', tagId);

            if (deleteLinksError) {
                console.error(`Error deleting linked items for tag ${tagId}:`, deleteLinksError);
                throw new Error(`Failed to delete linked items for tag: ${deleteLinksError.message}`);
            }

            // עכשיו מחק את התגית עצמה
            console.log(`Deleting tag with id ${tagId} from ${this.tableName}`);
            const { error: deleteTagError } = await this.supabase
                .from(this.tableName)
                .delete()
                .eq('tag_id', tagId);

            if (deleteTagError) {
                console.error('Error deleting tag:', deleteTagError);
                throw new Error(`Failed to delete tag: ${deleteTagError.message}`);
            }
            console.log(`Tag with id ${tagId} and its linked items deleted successfully.`);
        } catch (error: any) {
            console.error(`Error in deleteTagById: ${error.message}`);
            throw error;
        }
    }

    async getTagByName(tagName: string): Promise<Tag | null> {
        const { data, error } = await this.supabase
            .from(this.tableName)
            .select('*')
            .eq('tag_name', tagName)
            .maybeSingle();

        if (error) {
            console.error('Error fetching tag by name:', error);
            throw new Error(`Failed to fetch tag by name: ${error.message}`);
        }

        return data ?? null;
    }

    async addTag(tagName: string): Promise<Tag> {
        const newTag = {
            tagName,
            dateAdded: new Date(),
            isAlreadyScanned: false,
        };

        const { data, error } = await this.supabase
            .from(this.tableName)
            .insert([this.toDbTag(newTag)])
            .select('*');

        if (error || !data || data.length === 0) {
            console.error('Error inserting tag:', error);
            throw new Error(`Failed to add tag: ${error?.message}`);
        }

        return {
            ...newTag,
            tagId: data[0].tag_id,
        };
    }

}
