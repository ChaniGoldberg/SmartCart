import { parseXMLPromosFullToJsonFile } from "../scripts/osherad/parseXMLPromosFullToJsonFile";
import { promises as fs } from "fs";
import path from "path";

// נעשה mock ל־fs
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

// XML לדוגמה
const mockXml = `
<Root>
  <XmlDocVersion>1.0</XmlDocVersion>
  <ChainId>123</ChainId>
  <SubChainId>456</SubChainId>
  <StoreId>789</StoreId>
  <BikoretNo>101112</BikoretNo>
  <DllVerNo>1.2.3</DllVerNo>
  <Items>
    <Item>
      <id>111</id>
      <name>Milk</name>
      <price>5.90</price>
      <amount>1</amount>
      <type>Dairy</type>
    </Item>
  </Items>
</Root>
`;

describe("parseXMLPromosFullToJsonFile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should parse XML to JSON correctly", async () => {
    const readFileMock = fs.readFile as jest.Mock;
    const writeFileMock = fs.writeFile as jest.Mock;

    // readFileMock.mockResolvedValue(mockXml);
    writeFileMock.mockResolvedValue(undefined);

    const result = await parseXMLPromosFullToJsonFile(mockXml);

    expect(result).toBeDefined();
    expect(result.ChainId).toBe("123");
    expect(result.BikoretNo).toBe("101112");
    expect(result.Items).toBeDefined();
    expect(result.Items.length).toBe(1);
    expect(result.Items[0].name).toBe("Milk");
    expect(result.Items[0].price).toBe("5.90");
    expect(result.Items[0].id).toBe("111");
    expect(result.Items[0].amount).toBe("1");
    expect(result.Items[0].type).toBe("Dairy");

    // expect(writtenData.XmlDocVersion).toBe("1.0");
    // expect(writtenData.Items[0].name).toBe("Milk");
  });
});

