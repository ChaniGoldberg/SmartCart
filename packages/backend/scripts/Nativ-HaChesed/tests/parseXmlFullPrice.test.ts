import { convertXMLPriceFullStringToFilteredJson } from '../parseXmlFullPrice';
import { parseStringPromise } from "xml2js";
import * as fs from "fs/promises";

// Mock fs and xml2js
jest.mock("fs/promises", () => ({
  readFile: jest.fn(),
}));
jest.mock("xml2js", () => ({
  parseStringPromise: jest.fn(),
}));

describe.only('convertXMLPriceFullStringToFilteredJson', () => {
  const xmlFilePath = 'mock-file.xml';

  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterAll(() => {
    (console.error as jest.Mock).mockRestore?.();
  });

  it('should parse valid XML and return Item[]', async () => {
    // Arrange
    const xmlString = '<Root><Items><Item><itemCode>123</itemCode><itemType>1</itemType><itemName>Test</itemName><manufacturerName>Manu</manufacturerName><manufactureCountry>IL</manufactureCountry><ManufacturerItemDescription>desc</ManufacturerItemDescription><itemStatus>true</itemStatus><itemId>555</itemId><tagid>1</tagid><tagid>2</tagid><correctItemName>good</correctItemName></Item></Items></Root>';
    (fs.readFile as jest.Mock).mockResolvedValueOnce(xmlString);
    (parseStringPromise as jest.Mock).mockResolvedValueOnce({
      Root: {
        Items: {
          Item: {
            itemCode: "123",
            itemType: "1",
            itemName: "Test",
            manufacturerName: "Manu",
            manufactureCountry: "IL",
            ManufacturerItemDescription: "desc",
            itemStatus: true,
            itemId: "555",
            tagid: ["1", "2"],
            correctItemName: "good"
          }
        }
      }
    });

    // Act
    const result = await convertXMLPriceFullStringToFilteredJson(xmlFilePath);

    // Assert
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({
      itemCode: 123,
      itemType: 1,
      itemName: "Test",
      manufacturerName: "Manu",
      manufactureCountry: "IL",
      manufacturerItemDescription: "desc",
      itemStatus: true,
      itemId: 555,
      tagsId: [1, 2],
      correctItemName: "good"
    });
  });

  it('should throw error if no items found', async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce('<Root></Root>');
    (parseStringPromise as jest.Mock).mockResolvedValueOnce({ Root: {} });

    await expect(convertXMLPriceFullStringToFilteredJson(xmlFilePath)).rejects.toThrow("No items found in XML.");
  });

  it('should throw error for malformed XML', async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce('<Root><Items><Item><');
    (parseStringPromise as jest.Mock).mockRejectedValueOnce(new Error('Parse error'));

    await expect(convertXMLPriceFullStringToFilteredJson(xmlFilePath)).rejects.toThrow();
  });

  it('should handle single item object (not array)', async () => {
    (fs.readFile as jest.Mock).mockResolvedValueOnce('<Root><Items><Item></Item></Items></Root>');
    (parseStringPromise as jest.Mock).mockResolvedValueOnce({
      Root: {
        Items: {
          Item: {
            itemCode: "1",
            itemType: "2",
            itemName: "A",
            manufacturerName: "",
            manufactureCountry: "",
            ManufacturerItemDescription: "",
            itemStatus: false,
            itemId: "10",
            tagid: "5",
            correctItemName: ""
          }
        }
      }
    });

    const result = await convertXMLPriceFullStringToFilteredJson(xmlFilePath);
    expect(result.length).toBe(1);
    expect(result[0].itemCode).toBe(1);
    expect(result[0].tagsId).toEqual([5]);
  });
});