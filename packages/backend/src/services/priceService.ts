import { Price } from "@smartcart/shared";
import { IPrice } from "../interfaces/IPrice";
import { IPriceRepository } from "../db/IRepositories/IPriceRepository";

export class PriceService implements IPrice {
    constructor(private priceRepository: IPriceRepository) {}

    async getAllPrices(): Promise<any[]> {
        return this.priceRepository.getAllPrices();
    }
}

export default PriceService;
