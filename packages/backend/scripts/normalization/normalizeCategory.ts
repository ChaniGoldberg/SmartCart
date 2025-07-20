import { Tag } from "@smartcart/shared/src/tag";
import "../../mockData/tags.json";
import "../../mockData/items.json";
import { Item } from "@smartcart/shared/src/item";
import path from 'path';

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const tagsData: Tag[] = require('../../mockData/tags.json') as Tag[];

async function getTagsFromGpt(products: Item[]): Promise<string> {
    const url = process.env.MOCK_GPT_URL;
    if (!url) {
        throw new Error('MOCK_GPT_URL is not defined');
    }
    try {
        const productNames = products.map(product => product.correctItemName);
        const tagNames = tagsData.map(tag => tag.tagName);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                products: productNames,
                tags: tagNames
            })
        });

        if (!response.ok) {
            throw new Error(`Error fetching tags from GPT: ${response.status} ${response.statusText}`);
        }

        const responseText = await response.text();
        return responseText;

    } catch (error) {
        console.error('Error calling GPT mock service:', error);
        return '';
    }
}

export default async function tagProductsByGPT(products: Item[]): Promise<string> {
    try {
        const responseFromGpt = await getTagsFromGpt(products);
        return responseFromGpt;

    } catch (error) {
        console.error('Error in tagProductsByGPT:', error);
        return '';
    }
}
