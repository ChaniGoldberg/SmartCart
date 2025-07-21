import { parsePriceFullXMLFileToPrice } from '../parsePriceFullToPrice'; // Adjust the import path accordingly
import * as fs from "fs/promises";
import { parseStringPromise } from "xml2js";

jest.mock("fs/promises");
jest.mock("xml2js", () => ({
    parseStringPromise: jest.fn(),
}));

describe('parsePriceFullXMLFileToPrice', () => {
    it('should parse XML file and return Price array', async () => {
        const mockXmlData = `
            <Root>
                <StoreId>1</StoreId>
                <Items>
                    <Item>
                        <ItemId>101</ItemId>
                        <ItemCode>202</ItemCode>
                        <ItemPrice>9.99</ItemPrice>
                        <PriceUpdateDate>2023-10-01T00:00:00Z</PriceUpdateDate>
                        <UnitQuantity>kg</UnitQuantity>
                        <Quantity>1</Quantity>
                        <UnitOfMeasure>kg</UnitOfMeasure>
                        <IsWeighted>1</IsWeighted>
                        <QuantityInPackage>1</QuantityInPackage>
                        <UnitOfMeasurePrice>9.99</UnitOfMeasurePrice>
                        <AllowDiscount>1</AllowDiscount>
                    </Item>
                </Items>
            </Root>
        `;
        
        (fs.readFile as jest.Mock).mockResolvedValue(mockXmlData);
        (parseStringPromise as jest.Mock).mockResolvedValue({
            Root: {
                StoreId: "1",
                Items: {
                    Item: {
                        ItemId: "101",
                        ItemCode: "202",
                        ItemPrice: "9.99",
                        PriceUpdateDate: "2023-10-01T00:00:00Z",
                        UnitQuantity: "kg",
                        Quantity: "1",
                        UnitOfMeasure: "kg",
                        IsWeighted: "1",
                        QuantityInPackage: "1",
                        UnitOfMeasurePrice: "9.99",
                        AllowDiscount: "1",
                    }
                }
            }
        });

        const result = await parsePriceFullXMLFileToPrice('path/to/xml');

        expect(result).toEqual([{
            priceId: 0,
            storePK: "1",
            itemId: 101,
            itemCode: 202,
            price: 9.99,
            priceUpdateDate: new Date("2023-10-01T00:00:00Z"),
            unitQuantity: "kg",
            quantity: 1,
            unitOfMeasure: "kg",
            isWeighted: true,
            quantityInPackage: "1",
            unitOfMeasurePrice: 9.99,
            allowDiscount: true,
        }]);
    });

    it('should throw an error if no items are found in XML', async () => {
        const mockXmlData = `
            <Root>
                <StoreId>1</StoreId>
                <Items></Items>
            </Root>
        `;
        
        (fs.readFile as jest.Mock).mockResolvedValue(mockXmlData);
        (parseStringPromise as jest.Mock).mockResolvedValue({
            Root: {
                StoreId: "1",
                Items: {}
            }
        });

        await expect(parsePriceFullXMLFileToPrice('path/to/xml')).rejects.toThrow("No items found in XML.");
    });
});