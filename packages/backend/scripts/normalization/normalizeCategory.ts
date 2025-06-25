import { categories } from "@smartcart/shared/src/categories"
import { Price } from "@smartcart/shared/src/prices"

async function getCategoryFromGpt(product: string): Promise<string> {

    const categoryUrl = `http://localhost:8080/Category/${encodeURIComponent(product)}`;
    const categoryResponse = await fetch(categoryUrl);

    if (!categoryResponse.ok) {
        throw new Error(`Error fetching category: ${categoryResponse.statusText}`);
    }

    const category = await categoryResponse.text();
    return category;
}

function checkCategoryInDB(categoryName: string): boolean {
    for (const category of categories) {
        if (category.name === categoryName) {
            return true;
        }
    }
    return false;
}

function addCategory(categoryName: string): void {
    return;
}

export default async function categorizeProductByGPT(product: Price): Promise<string> {

    const categoryOfProduct = await getCategoryFromGpt(product.ItemName);
    if (!checkCategoryInDB(categoryOfProduct)) {
        addCategory(categoryOfProduct);
    }

    return categoryOfProduct;
}
