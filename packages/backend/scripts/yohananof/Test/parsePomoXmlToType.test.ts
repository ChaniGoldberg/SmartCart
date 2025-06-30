import { parseXmlToJson, normalizePromotions, parseXmlPromotionsToJson } from '@smartcart/backend/scripts/yohananof/ParsePromoXmlToType';
import { Promotion } from '@smartcart/shared/src/promotions';
const mockXml=`<Root>
  <XmlDocVersion>19</XmlDocVersion>
  <ChainId>7290803800003</ChainId>
  <SubChainId>1</SubChainId>
  <StoreId>005</StoreId>
  <BikoretNo>2</BikoretNo>
  <DllVerNo>9.4.0.50</DllVerNo>
  <Promotions Count="1161">
    <Promotion>
      <PromotionId>165892</PromotionId>
      <PromotionDescription>שוקיים מקוצר 2 קג ב-60 רשתי</PromotionDescription>
      <PromotionUpdateDate>2025-05-14 00:00</PromotionUpdateDate>
      <PromotionStartDate>2017-11-15</PromotionStartDate>
      <PromotionStartHour>00:00:00</PromotionStartHour>
      <PromotionEndDate>2025-08-09</PromotionEndDate>
      <PromotionEndHour>23:59:00</PromotionEndHour>
      <RewardType>1</RewardType>
      <AllowMultipleDiscounts>1</AllowMultipleDiscounts>
      <IsWeightedPromo>1</IsWeightedPromo>
      <AdditionalRestrictions>
        <AdditionalIsCoupon>0</AdditionalIsCoupon>
        <AdditionalGiftCount>0</AdditionalGiftCount>
        <AdditionalIsTotal>0</AdditionalIsTotal>
        <AdditionalIsActive>1</AdditionalIsActive>
      </AdditionalRestrictions>
      <MinQty>1.90</MinQty>
      <DiscountedPrice>30.00</DiscountedPrice>
      <DiscountedPricePerMida>57.00</DiscountedPricePerMida>
      <MinNoOfItemOfered>10</MinNoOfItemOfered>
      <PromotionItems>
        <Item>
          <ItemCode>7290000406169</ItemCode>
          <ItemType>1</ItemType>
          <IsGiftItem>0</IsGiftItem>
        </Item>
      </PromotionItems>
      <Clubs>
        <ClubId>0</ClubId>
      </Clubs>
    </Promotion>
    <Promotion>
      <PromotionId>178510</PromotionId>
      <PromotionDescription>שישליק הודו 2קג ב-65 רשתי</PromotionDescription>
      <PromotionUpdateDate>2025-05-14 00:00</PromotionUpdateDate>
      <PromotionStartDate>2018-12-12</PromotionStartDate>
      <PromotionStartHour>00:00:00</PromotionStartHour>
      <PromotionEndDate>2025-08-09</PromotionEndDate>
      <PromotionEndHour>23:59:00</PromotionEndHour>
      <RewardType>1</RewardType>
      <AllowMultipleDiscounts>1</AllowMultipleDiscounts>
      <IsWeightedPromo>1</IsWeightedPromo>
      <AdditionalRestrictions>
        <AdditionalIsCoupon>0</AdditionalIsCoupon>
        <AdditionalGiftCount>0</AdditionalGiftCount>
        <AdditionalIsTotal>0</AdditionalIsTotal>
        <AdditionalIsActive>1</AdditionalIsActive>
      </AdditionalRestrictions>
      <MinQty>1.90</MinQty>
      <DiscountedPrice>32.50</DiscountedPrice>
      <DiscountedPricePerMida>61.75</DiscountedPricePerMida>
      <MinNoOfItemOfered>10</MinNoOfItemOfered>
      <PromotionItems>
        <Item>
          <ItemCode>7290000400433</ItemCode>
          <ItemType>1</ItemType>
          <IsGiftItem>0</IsGiftItem>
        </Item>
      </PromotionItems>
      <Clubs>
        <ClubId>0</ClubId>
      </Clubs>
    </Promotion>
  </Promotions>
</Root>
    `;

describe('Promotion XML Parser', () => {
  it('should parse valid XML to JSON', async () => {
    const json = await parseXmlToJson(mockXml);
    expect(json).toHaveProperty('Root');
  });

  it('should normalize JSON to Promotion[]', async () => {
    const json = await parseXmlToJson(mockXml);
    const promotions = normalizePromotions(json);
    expect(Array.isArray(promotions)).toBe(true);
    expect(promotions.length).toBe(2);
    const promo = promotions[0];
    expect(promo.promotionId).toBe(165892);
    expect(promo.discountedPrice).toBe(30.00);
    console.log(promo);
    
  });

  it('should parse XML and return Promotion[] using full flow', async () => {
    const promotions = await parseXmlPromotionsToJson(mockXml);
    expect(promotions.length).toBe(2);
    expect(promotions[0].promotionId).toBe(165892);
  });

  it('should throw an error for empty XML string', async () => {
    await expect(parseXmlPromotionsToJson("")).rejects.toThrow("Invalid XML data");
  });
});
