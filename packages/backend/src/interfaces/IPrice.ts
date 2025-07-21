import { Price } from "@smartcart/shared/src/price"

export interface IPrice {

    getAllPrices(): Promise<Price[]>

    
}