import { Category } from "@smartcart/shared/src/categories"

export interface category {

    getAllcategory():Promise<Category[]>
    addCategory(categoryName: string): Promise<Category> 

}