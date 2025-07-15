import { db } from "../db/dbProvider";
import { Price } from "@smartcart/shared/src/price";
import { IPrice } from "../interfaces/IPrice";
export class PriceService implements IPrice {
    private db: typeof db;

    constructor() {
        this.db = db;
    }

    async getAllPrices(): Promise<Price[]> {
        return this.db.Price;;
    }
}

export default PriceService;



