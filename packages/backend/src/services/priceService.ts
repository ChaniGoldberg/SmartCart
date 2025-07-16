import { Price } from "@smartcart/shared/src/price";
import { IPrice } from "../interfaces/IPrice";
import { IPriceRepository } from "../db/IRepositories/IPriceRepository";

export class PriceService implements IPrice {
    constructor(private priceRepository: IPriceRepository) {}

    async getAllPrices(): Promise<Price[]> {
        return this.priceRepository.getAllPrices();
    }
}

export default PriceService;
