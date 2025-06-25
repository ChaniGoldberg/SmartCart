import { convertXMLPromotionStringToFilteredJson } from '../parseXMLPromosFullToJson';
import * as fs from 'fs';

const mockXml = `<Root>
  <ChainId>7290058160839</ChainId>
  <SubChainId>1</SubChainId>
  <StoreId>304</StoreId>
  <BikoretNo>7</BikoretNo>
  <Promotions count="1">
    <Promotion>
      <PromotionId>1000049953</PromotionId>
      <PromotionDescription>מגבונים דלוקס -3 ב10</PromotionDescription>
      <PromotionUpdateDate>2025-06-19 14:44:00</PromotionUpdateDate>
      <PromotionStartDate>2025-06-19</PromotionStartDate>
      <PromotionStartHour>00:00:00</PromotionStartHour>
      <PromotionEndDate>2025-06-28</PromotionEndDate>
      <PromotionEndHour>23:59:00</PromotionEndHour>
      <RewardType>1</RewardType>
      <DiscountType>1</DiscountType>
      <DiscountRate>0.00</DiscountRate>
      <AllowMultipleDiscounts>0</AllowMultipleDiscounts>
      <MinQty>3</MinQty>
      <MAXQTY>0</MAXQTY>
      <DiscountedPrice>10</DiscountedPrice>
      <DiscountedPricePerMida>10</DiscountedPricePerMida>
      <MinNoOfItemOfered>10</MinNoOfItemOfered>
      <AdditionalRestrictions>
        <AdditionalIsCoupon>0</AdditionalIsCoupon>
        <AdditionalGiftCount>0</AdditionalGiftCount>
        <Clubs>
          <ClubId>0</ClubId>
        </Clubs>
        <AdditionalIsTotal>0</AdditionalIsTotal>
        <AdditionalIsActive>1</AdditionalIsActive>
      </AdditionalRestrictions>
      <PromotionItems count="1">
        <Item>
          <ItemCode>44410</ItemCode>
          <IsGiftItem>0</IsGiftItem>
          <ItemType>1</ItemType>
        </Item>
      </PromotionItems>
      <Remarks/>
    </Promotion>
  </Promotions>
</Root>`;

describe('convertXMLPromotionStringToFilteredJson', () => {
  it('should parse valid XML and create JSON file', async () => {
    const outputPath = await convertXMLPromotionStringToFilteredJson(mockXml);

    expect(fs.existsSync(outputPath)).toBe(true);

    const json = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBe(1);

    expect(json[0].promotionId).toBe(1000049953);
    expect(json[0].promotionDescription).toBe("מגבונים דלוקס -3 ב10");
    expect(json[0].discountedPrice).toBe(10);
    expect(json[0].promotionItems[0].id).toBe('44410');

    expect(json[0].chainId).toBe('7290058160839');
    expect(json[0].subChainId).toBe('1');
    expect(json[0].storeId).toBe('304');

    expect(json[0].isActive).toBe(true);
    expect(json[0].promotionsTerms.minQty).toBe(3);
    expect(json[0].promotionsTerms.maxQty).toBe(0);
    expect(json[0].promotionsTerms.minNoOfItemOfered).toBe(10);
    expect(json[0].promotionsTerms.additionalRestrictions.requiresCoupon).toBe(false);
    expect(json[0].promotionsTerms.additionalRestrictions.requiresClubMembership).toBe(false);
    expect(json[0].promotionsTerms.additionalRestrictions.clubId).toBe('0');
  });

  it('should throw an error for empty XML', async () => {
    await expect(convertXMLPromotionStringToFilteredJson('')).rejects.toThrow('Empty XML content');
  });
});
