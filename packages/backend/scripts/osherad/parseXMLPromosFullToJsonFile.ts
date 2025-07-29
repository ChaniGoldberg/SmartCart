import * as xml2js from "xml2js";
import { Promotion } from '@smartcart/shared/src/promotion';

export async function parseXmlToJson(xmlContent: string): Promise<object> {
  if (!xmlContent) {
    throw new Error("Invalid XML content");
  }

  try {
    const parser = new xml2js.Parser();
    return await parser.parseStringPromise(xmlContent);
  } catch (err) {
    throw new Error(`Failed to parse XML to JSON: ${err}`);
  }
}

export function normalizePromotions(rawData: any): Promotion[] {
  try {
    const promotionsRaw = rawData?.Root?.Promotions?.[0]?.Promotion;
    if (!promotionsRaw) {
      throw new Error("No promotions found in the parsed JSON.");
    }

    const promotionsArray = Array.isArray(promotionsRaw) ? promotionsRaw : [promotionsRaw];
    const chainId = rawData?.Root?.ChainId?.[0];
    const subChainId = rawData?.Root?.SubChainId?.[0];
    const storeId = rawData?.Root?.StoreId?.[0];
    console.log(JSON.stringify(promotionsArray[0], null, 2));
    
    return promotionsArray.map((promo: any) =>
      convertRawPromotionToPromotion(promo, chainId, subChainId, storeId)
    );
  } catch (error) {
    console.error("Error normalizing promotions:", error);
    throw error;
  }
}

function convertRawPromotionToPromotion(
  rawPromo: any,
  chainId: string,
  subChainId: string,
  storeId: string
): Promotion {
  const promotionItemsCode = (rawPromo?.PromotionItems || []).map((item: any) => 
    item?.Item?.[0]?.ItemCode?.[0] ?? "");



  return {
    promotionId: parseInt(rawPromo?.PromotionId?.[0] ?? "0"),
    storePK: `${chainId}-${subChainId}-${storeId}`,
    promotionDescription: rawPromo?.PromotionDescription?.[0] ?? "",
    startDate: new Date(`${rawPromo?.PromotionStartDate?.[0] || ''}T${rawPromo?.PromotionStartHour?.[0] || ''}`),
    endDate: new Date(`${rawPromo?.PromotionEndDate?.[0] || ''}T${rawPromo?.PromotionEndHour?.[0] || ''}`),
    lastUpdated: new Date(rawPromo?.PromotionUpdateDate?.[0] ?? ""),
    isActive: true,
    discountedPrice: parseFloat(rawPromo?.DiscountedPrice?.[0] ?? "0"),
    promotionItemsCode,//fk
    minQuantity: parseFloat(rawPromo?.MinQty?.[0] ?? "0"),
    maxQuantity: rawPromo?.MaxQty?.[0] ? parseFloat(rawPromo.MaxQty[0]) : undefined,
    requiresCoupon: rawPromo?.AdditionalRestrictions?.[0]?.AdditionalIsCoupon == "1",
    requiresClubMembership: rawPromo?.Clubs?.[0]?.ClubId?.[0] != "0",
    clubId: parseInt(rawPromo.Clubs[0].ClubId[0]),
    additionalGiftCount: parseInt(rawPromo?.AdditionalRestrictions?.[0]?.AdditionalGiftCount?.[0] ?? "0"),
    minNumberOfItemOfered: parseInt(rawPromo?.MinNoOfItemOfered?.[0] ?? "0"),
    remarks: rawPromo?.Remarks?.[0] ?? "",
  }
};

//main
export async function parseXmlPromotionsToJson(xmlData: string): Promise<Promotion[]> {
  if (!xmlData) {
    throw new Error("Invalid XML data");
  }
  try {
    const jsonData = await parseXmlToJson(xmlData);
    return normalizePromotions(jsonData);
  } catch (err) {
    console.error("Error parsing XML to Promotion array:", err);
    throw err;
  }
}
