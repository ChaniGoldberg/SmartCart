import { parseXmlToJson } from "../parseFullPriceXmlToJson";
import { cleanJsonObjects } from "../parseFullPriceXmlToJson";
import { Chain } from "@smartcart/shared/src/stores";
describe('parseXmlToJson', () => {
  it('should parse valid XML into cleaned JSON', async () => {
    const xml = `
      <Root>
        <ChainID>123</ChainID>
        <ChainName>Test Chain</ChainName>
      </Root>
    `;

    const result:any = await parseXmlToJson(xml);

    expect(result).toBeDefined();
    expect(result).toHaveProperty('Root');
    expect(result?.Root.ChainID[0]).toBe('123');
    expect(result?.Root.ChainName[0]).toBe('Test Chain');
  });

  it('should throw an error for empty input', async () => {
    await expect(parseXmlToJson('')).rejects.toThrow('Invalid XML content');
  });

  it('should throw an error for invalid XML', async () => {
    const invalidXml = `<Root><UnclosedTag></Root>`;
    await expect(parseXmlToJson(invalidXml)).rejects.toThrow();
  });
});

///////////////////////////////////////////////////////////////////

describe("cleanJsonOcjects", () => {
  const mockInput = {
    Root: {
      ChainID: ["123"],
      ChainName: ["TestChain"],
      LastUpdateDate: ["12"],
      LastUpdateTime: ["3600000"],
      SubChain: [
        {
          SubChainID: ["456"],
          SubChainName: ["TestSubChain"]
        }
      ],
      Stores: [
        {
          StoreID: ["789"],
          StoreName: ["Test Store"],
          Address: ["123 Test St"],
          City: ["Testville"],
          ZipCode: ["00000"]
        }
      ]
    }
  };

  it("should convert raw JSON object to structured Chain object", async () => {
    const result:Chain = await cleanJsonObjects(mockInput) as Chain;
    expect(result).toBeDefined();
    expect(result?.chainId).toBe("123");
    expect(result?.chainName).toBe("TestChain");
    expect(result?.subChains.length).toBe(1);

    const subChain = result?.subChains[0];
    expect(subChain.subChainId).toBe("456");
    expect(subChain.subChainName).toBe("TestSubChain");
    expect(subChain.stores.length).toBe(1);

    const store = subChain.stores[0];
    expect(store.storeId).toBe("789");
    expect(store.storeName).toBe("Test Store");
    expect(store.address).toBe("123 Test St");
    expect(store.city).toBe("Testville");
    expect(store.zipCode).toBe("00000");
    expect(store.chainId).toBe("123");
    expect(store.subChainId).toBe("456");

    expect(result?.lastUpdateDate).toBeInstanceOf(Date);
  });

  it("should handle invalid input gracefully", async () => {
    const badInput = {};
    const result = await cleanJsonObjects(badInput);
    expect(result).toBeUndefined();
  });
});