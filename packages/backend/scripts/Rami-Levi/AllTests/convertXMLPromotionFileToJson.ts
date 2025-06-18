import * as fs from "fs";
import * as xml2js from "xml2js";
import {
    convertXMLPromotionFileToJson,
    filterPromotions,
    getFieldNamesAsArray
} from "../convertXMLPromotionFileToJson";

jest.mock("fs", () => {
    const actualFs = jest.requireActual("fs");
    return {
        ...actualFs,
        readFileSync: jest.fn(),
        writeFileSync: jest.fn(),
        promises: {
            readFile: jest.fn(),
            writeFile: jest.fn()
        }
    };
});

beforeEach(() => {
    jest.clearAllMocks();
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify({}));
    (fs.promises as any).readFile = jest.fn().mockResolvedValue(JSON.stringify({}));
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
});

describe("convertXmlToJson", () => {
    it("should throw error for empty XML content", async () => {
        await expect(convertXMLPromotionFileToJson("")).rejects.toThrow("Invalid XML content");
    });

    it("should throw error on invalid XML", async () => {
        const invalidXml = `<root><item></root>`;
        await expect(convertXMLPromotionFileToJson(invalidXml)).rejects.toThrow();
    });

    it("should convert valid XML content to JSON and write to file", async () => {
        const xmlContent = `<Root><Promotions><Promotion><PromotionId>123</PromotionId><PromotionDescription>מבצע בדיקה</PromotionDescription></Promotion></Promotions></Root>`;
        const expectedJsonPath = require("path").resolve(__dirname, "../xmlContent.json");

        const parseStringPromiseMock = jest.spyOn(xml2js.Parser.prototype, "parseStringPromise");
        parseStringPromiseMock.mockResolvedValue({
            Root: {
                Promotions: [{
                    Promotion: [{
                        PromotionId: ["123"],
                        PromotionDescription: ["מבצע בדיקה"],
                        PromotionStartDate: ["2023-01-01"]
                    }]
                }]
            }
        });

        const result = await convertXMLPromotionFileToJson(xmlContent);

        expect(result).toBe(expectedJsonPath);
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            expectedJsonPath,
            expect.any(String),
            "utf-8"
        );
        parseStringPromiseMock.mockRestore();
    });

    it("should throw error if a non-Error is thrown", async () => {
        const originalParseStringPromise = xml2js.Parser.prototype.parseStringPromise;
        xml2js.Parser.prototype.parseStringPromise = () => { throw 123; };
        await expect(convertXMLPromotionFileToJson("<root></root>")).rejects.toThrow("123");
        xml2js.Parser.prototype.parseStringPromise = originalParseStringPromise;
    });
});

describe("getFieldNamesAsArray", () => {
    it("should return an array of field names", () => {
        const arr = getFieldNamesAsArray();
        expect(Array.isArray(arr)).toBe(true);
        expect(arr).toContain("promotionId");
        expect(arr).toContain("minQty");
        expect(arr).toContain("clubId");
    });
});

describe("filterPromotions", () => {
    it("should filter only requested fields", async () => {
        const fields = ["promotionId", "promotionDescription"];
        const jsonMock = {
            Root: {
                Promotions: [{
                    Promotion: [{
                        PromotionId: ["123"],
                        PromotionDescription: ["מבצע בדיקה"],
                        PromotionStartDate: ["2023-01-01"]
                    }]
                }]
            }
        };
        const filtered = await filterPromotions(JSON.stringify(jsonMock), fields);
        expect(filtered.Promotions[0].promotionId).toBe("123");
        expect(filtered.Promotions[0].promotionDescription).toBe("מבצע בדיקה");
        expect(filtered.Promotions[0].startDate).toBeUndefined();
    });

    it("should throw error if Promotions not found", async () => {
        const fields = ["promotionId"];
        const jsonMock = { Root: {} };
        await expect(filterPromotions(JSON.stringify(jsonMock), fields)).rejects.toThrow("Promotions not found or not an array");
    });

    it("should throw wrapped error if exception occurs", async () => {
        await expect(filterPromotions("not a json", ["promotionId"])).rejects.toThrow("Error filtering promotions");
    });
});