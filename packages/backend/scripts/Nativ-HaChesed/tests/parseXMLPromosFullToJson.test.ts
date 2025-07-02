import { convertXMLPromotionStringToFilteredJson } from '../parseXMLPromosFullToJson';

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

describe.only('convertXMLPromotionStringToFilteredJson', () => {
  it('should parse valid XML and return Promotion[]', async () => {
    const result = await convertXMLPromotionStringToFilteredJson(mockXml);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);

    const promo = result[0];
    expect(promo.promotionId).toBe(1000049953);
    expect(promo.promotionDescription).toBe("מגבונים דלוקס -3 ב10");
    expect(promo.discountedPrice).toBe(10);
    expect(promo.promotionItemsCode).toContain(44410); // צריך להיות מספר
    expect(promo.storeId).toBe(304);
    expect(promo.isActive).toBe(true);
    expect(promo.minQuantity).toBe(3);
    expect(promo.maxQuantity).toBe(0);
    expect(promo.minNumberOfItemOfered).toBe(10);
    expect(promo.requiresCoupon).toBe(false);
    expect(promo.requiresClubMembership).toBe(false);
    expect(promo.clubId).toBe(0);
    expect(promo.remarks).toBe('');
    expect(promo.lastUpdated).toBeInstanceOf(Date);
    expect(promo.startDate).toBeInstanceOf(Date);
    expect(promo.endDate).toBeInstanceOf(Date);
  });

  it('should throw an error for empty XML', async () => {
    await expect(convertXMLPromotionStringToFilteredJson('')).rejects.toThrow('Invalid XML data');
  });
});