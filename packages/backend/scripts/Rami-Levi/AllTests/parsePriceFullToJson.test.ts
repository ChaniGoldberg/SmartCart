import { parseXMLFileToJson } from '../parsePriceFullToJson';
import * as fs from 'fs/promises';

jest.mock('fs/promises');

describe('parseXmlItemsToJson', () => {
    const mockXmlData = `
    <Root>
        <ChainId>123</ChainId>
        <StoreId>456</StoreId>
        <Items>
            <Item>
                <PriceUpdateDate>2023-10-01</PriceUpdateDate>
                <ItemCode>ABC123</ItemCode>
                <ItemType>1</ItemType>
                <ItemName>Test Item</ItemName>
                <ManufacturerName>Test Manufacturer</ManufacturerName>
                <ManufactureCountry>Test Country</ManufactureCountry>
                <ManufacturerItemDescription>Test Description</ManufacturerItemDescription>
                <UnitQty>1</UnitQty>
                <Quantity>10</Quantity>
                <UnitOfMeasure>kg</UnitOfMeasure>
                <bIsWeighted>1</bIsWeighted>
                <QtyInPackage>1</QtyInPackage>
                <ItemPrice>99.99</ItemPrice>
                <UnitOfMeasurePrice>99.99</UnitOfMeasurePrice>
                <AllowDiscount>1</AllowDiscount>
                <ItemStatus>1</ItemStatus>
            </Item>
        </Items>
    </Root>`;

    beforeEach(() => {
        (fs.readFile as jest.Mock).mockResolvedValue(mockXmlData);
    });

    it('should parse XML file and return items', async () => {
        const items = await parseXMLFileToJson('dummy/path/to/xml/file.xml');

        expect(items).toHaveLength(1);
        expect(items[0]).toEqual({
            ChainId: '123',
            StoreId: '456',
            PriceUpdateDate: new Date('2023-10-01'),
            ItemCode: 'ABC123',
            ItemType: 1,
            ItemName: 'Test Item',
            ManufacturerName: 'Test Manufacturer',
            ManufactureCountry: 'Test Country',
            ManufacturerItemDescription: 'Test Description',
            UnitQty: '1',
            Quantity: 10,
            UnitOfMeasure: 'kg',
            bIsWeighted: 1,
            QtyInPackage: '1',
            ItemPrice: 99.99,
            UnitOfMeasurePrice: 99.99,
            AllowDiscount: 1,
            ItemStatus: 1,
            CorrectItemName: '',
            Category: '',
        });
    });

    it('should throw an error if no items found', async () => {
        (fs.readFile as jest.Mock).mockResolvedValue('<Root><ChainId>123</ChainId><StoreId>456</StoreId><Items></Items></Root>');

        await expect(parseXMLFileToJson('dummy/path/to/xml/file.xml')).rejects.toThrow('No items found in XML.');
    });
});
