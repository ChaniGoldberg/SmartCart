// parsePriceFullXMLFileToItem.test.ts
import * as fs from 'fs/promises';
import { parsePriceFullXMLFileToItem, readAndParseXmlFile, extractItemsFromXmlToItem } from '../parsePriceFullToItem';
import { parseStringPromise } from 'xml2js';

jest.mock('fs/promises');
jest.mock('xml2js', () => ({
    parseStringPromise: jest.fn(),
}));

describe('XML Parsing Functions', () => {
    const mockXmlData = `
        <Root>
            <Items>
                <Item>
                    <ItemCode>123</ItemCode>
                    <ItemId>1</ItemId>
                    <ItemType>2</ItemType>
                    <ItemName>Test Item</ItemName>
                    <ManufacturerName>Test Manufacturer</ManufacturerName>
                    <ManufactureCountry>Test Country</ManufactureCountry>
                    <ManufacturerItemDescription>Test Description</ManufacturerItemDescription>
                    <ItemStatus>1</ItemStatus>
                </Item>
            </Items>
        </Root>
    `;

    const mockJsonData = {
        Root: {
            Items: {
                Item: {
                    ItemCode: '123',
                    ItemId: '1',
                    ItemType: '2',
                    ItemName: 'Test Item',
                    ManufacturerName: 'Test Manufacturer',
                    ManufactureCountry: 'Test Country',
                    ManufacturerItemDescription: 'Test Description',
                    ItemStatus: '1',
                },
            },
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should parse XML file to Item array', async () => {
        (fs.readFile as any).mockResolvedValueOnce(mockXmlData);
        (parseStringPromise as any).mockResolvedValueOnce(mockJsonData);

        const items = await parsePriceFullXMLFileToItem('path/to/xml/file.xml');

        expect(items).toEqual([
            {
                itemCode: 123,
                itemId: 1,
                itemType: 2,
                itemName: 'Test Item',
                correctItemName: '',
                manufacturerName: 'Test Manufacturer',
                manufactureCountry: 'Test Country',
                manufacturerItemDescription: 'Test Description',
                itemStatus: true,
                tagsId: [],
            },
        ]);
    });

    test('should throw an error if no items found in XML', async () => {
        const emptyJsonData = { Root: { Items: {} } };
        (fs.readFile as any).mockResolvedValueOnce(mockXmlData);
        (parseStringPromise as any).mockResolvedValueOnce(emptyJsonData);

        await expect(parsePriceFullXMLFileToItem('path/to/xml/file.xml')).rejects.toThrow('No items found in XML.');
    });

    test('should read and parse XML file', async () => {
        (fs.readFile as any).mockResolvedValueOnce(mockXmlData);
        (parseStringPromise as any).mockResolvedValueOnce(mockJsonData);

        const jsonData = await readAndParseXmlFile('./ppp.xml');
        expect(jsonData).toEqual(mockJsonData);
    });

    test('should extract items from parsed JSON data', async () => {
        const items = await extractItemsFromXmlToItem(mockJsonData);
        expect(items).toEqual([
            {
                itemCode: 123,
                itemId: 1,
                itemType: 2,
                itemName: 'Test Item',
                correctItemName: '',
                manufacturerName: 'Test Manufacturer',
                manufactureCountry: 'Test Country',
                manufacturerItemDescription: 'Test Description',
                itemStatus: true,
                tagsId: [],
            },
        ]);
    });
});