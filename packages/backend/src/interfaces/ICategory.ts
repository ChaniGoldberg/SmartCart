import { Category } from "@smartcart/shared/src/categories"

export interface ICategory {

    getAllcategory():Promise<Category[]>
    addCategory(categoryName: string): Promise<Category> 

}