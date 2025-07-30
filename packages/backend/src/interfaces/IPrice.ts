import { Price } from "@smartcart/shared"

export interface IPrice {

    getAllPrices(): Promise<Price[]>

    
}