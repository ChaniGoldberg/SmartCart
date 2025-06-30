import { categories } from "@smartcart/shared/src/categories"
import { Price } from "@smartcart/shared/src/prices"
require('dotenv').config();



async function getTagFromGpt(product: string): Promise<string> {

    const tagUrl = `${process.env.OPEN_AI_URL}/${encodeURIComponent(product)}`;
    const tagResponse = await fetch(tagUrl);

    if (!tagResponse.ok) {
        throw new Error(`Error fetching tag: ${tagResponse.statusText}`);
    }

    const tag = await tagResponse.text();
    return tag;
}

function checkTagInDB(tagName: string): boolean {
    for (const tag of categories) {
        if (tag.name === tagName) {
            return true;
        }
    }
    return false;
}

function addCategory(tagName: string): void {
    return;
}

export default async function tagProductByGPT(product: Price): Promise<string> {

    const tagOfProduct = await getTagFromGpt(product.ItemName);
    if (!checkTagInDB(tagOfProduct)) {
        addCategory(tagOfProduct);
    }

    return tagOfProduct;
}
