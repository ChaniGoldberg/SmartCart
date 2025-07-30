import { parseXmlToJson, normalizePromotions, parseXmlPromotionsToJson } from "../convertXMLPromotionFileToJson";
import { Promotion } from '@smartcart/shared/src/promotion';

interface ParsedXml {
  Root: {
    ChainId?: string[];
    SubChainId?: string[];
    StoreId?: string[];
    Promotions?: Array<{
      Promotion: any[];
    }>;
  };
}

const sampleXml = `
<Root>
  <ChainId>123</ChainId>
  <SubChainId>45</SubChainId>
  <StoreId>678</StoreId>
  <Promotions>
    <Promotion>
      <PromotionId>1</PromotionId>
      <PromotionDescription>Sample Promo</PromotionDescription>
      <PromotionStartDate>2025-07-24</PromotionStartDate>
      <PromotionStartHour>08:00:00</PromotionStartHour>
      <PromotionEndDate>2025-07-31</PromotionEndDate>
      <PromotionEndHour>23:59:59</PromotionEndHour>
      <PromotionUpdateDate>2025-07-20</PromotionUpdateDate>
      <DiscountedPrice>9.99</DiscountedPrice>
      <PromotionItems>
        <Item>
          <ItemCode>ABC123</ItemCode>
        </Item>
        <Item>
          <ItemCode>XYZ789</ItemCode>
        </Item>
      </PromotionItems>
      <MinQty>1</MinQty>
      <MaxQty>5</MaxQty>
      <AdditionalRestrictions>
        <AdditionalIsCoupon>1</AdditionalIsCoupon>
        <AdditionalGiftCount>2</AdditionalGiftCount>
      </AdditionalRestrictions>
      <Clubs>
        <ClubId>10</ClubId>
      </Clubs>
      <MinNoOfItemOfered>3</MinNoOfItemOfered>
      <Remarks>Test remarks</Remarks>
    </Promotion>
  </Promotions>
</Root>
`;

describe("XML to Promotion parsing", () => {
  it("should parse XML string to JSON object", async () => {
    const json = await parseXmlToJson(sampleXml) as ParsedXml;
    expect(json.Root).toBeDefined();
    expect(json.Root.Promotions).toBeDefined();
  });

  it("should normalize promotions correctly", async () => {
    const jsonData = await parseXmlToJson(sampleXml) as ParsedXml;
    const promotions = normalizePromotions(jsonData);

    expect(promotions).toHaveLength(1);
    const promo = promotions[0];
    expect(promo.promotionId).toBe(1);
    expect(promo.storePK).toBe("123-45-678");
    expect(promo.promotionDescription).toBe("Sample Promo");
    expect(promo.discountedPrice).toBeCloseTo(9.99);
    expect(promo.promotionItemsCode).toEqual(["ABC123", "XYZ789"]);
    expect(promo.requiresCoupon).toBe(true);
    expect(promo.requiresClubMembership).toBe(true);
    expect(promo.clubId).toBe(10);
    expect(promo.additionalGiftCount).toBe(2);
    expect(promo.minNumberOfItemOfered).toBe(3);
    expect(promo.remarks).toBe("Test remarks");
  });

  it("should throw error when no promotions found", () => {
    const invalidJson = { Root: {} };
    expect(() => normalizePromotions(invalidJson)).toThrow("No promotions found in the parsed JSON.");
  });

  it("should throw error on empty XML input", async () => {
    await expect(parseXmlToJson("")).rejects.toThrow("Invalid XML content");
  });

  it("should parse full flow correctly", async () => {
    const promotions = await parseXmlPromotionsToJson(sampleXml);
    expect(Array.isArray(promotions)).toBe(true);
    expect(promotions.length).toBeGreaterThan(0);
  });
});