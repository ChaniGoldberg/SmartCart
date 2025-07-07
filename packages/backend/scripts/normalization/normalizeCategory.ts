import { Tag } from "@smartcart/shared/src/tag";
import "../../mockData/tags.json";
import "../../mockData/items.json";
import { Item } from "@smartcart/shared/src/item";
import { mockDb } from "../../src/db/mock/mockDB";
import path from 'path';
import { db } from "../../src/db/dbProvider";

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const tagsData: Tag[] = require('../../mockData/tags.json') as Tag[];

async function getTagFromGpt(productName: string): Promise<string[]> {
    const encodedProductName = encodeURIComponent(productName);
const url = `${process.env.OPEN_AI_URL}/${encodedProductName}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error fetching tag: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();

        try {
            const tags = JSON.parse(responseText);

            if (Array.isArray(tags)) {
                return tags;
            }

            if (typeof tags === 'string') {
                return [tags];
            }

            return [String(tags)];

        } catch (parseError) {
            if (responseText.includes(',')) {
                return responseText.split(',').map(tag => tag.trim().replace(/"/g, ''));
            }
            return [responseText.trim().replace(/"/g, '')];
        }

    } catch (error) {
        throw new Error(`Failed to fetch tag from GPT: ${error}`);
    }
}



async function checkTagInDB(tagNames: string[]): Promise<{ existingTags: Tag[], missingTags: string[] }> {
    const foundTags = tagsData.filter(tag => tagNames.includes(tag.tagName));
    const foundTagNames = foundTags.map(tag => tag.tagName);
    const missingTags = tagNames.filter(tagName => !foundTagNames.includes(tagName));

    return {
        existingTags: foundTags,
        missingTags: missingTags
    };
}
//צריך להדרס על ידי הפונקציה של חיה פרטיג
function addTag(tagName: string): Tag {
    const newTag: Tag = { tagId: tagsData.length + 1, tagName, dateAdded: new Date(), isAlreadyScanned: false };
    return newTag;
}



export default async function tagProductByGPT(product: Item): Promise<number[]> {
    const tagOfProduct = await getTagFromGpt(product.correctItemName);
    const { existingTags, missingTags } = await checkTagInDB(tagOfProduct);

    const tagIds: number[] = [];

    existingTags.forEach(tag => {
        db.save(tag);
        tagIds.push(tag.tagId);
    });

    missingTags.forEach(tagName => {
        const newTag = addTag(tagName);
        db.save(newTag);
        tagIds.push(newTag.tagId);
    });

    return tagIds;
}


