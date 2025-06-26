import * as fs from "fs";
import * as xml2js from "xml2js";
import * as path from "path";

// ממיר מחרוזת XML למערך מבצעים מסונן ושומר לקובץ JSON
export async function convertXMLPromotionStringToFilteredJson(xmlContent: string): Promise<string> {
  if (!xmlContent) throw new Error("Empty XML content");

  const parser = new xml2js.Parser({ explicitArray: true });
  const parsed = await parser.parseStringPromise(xmlContent);
  const root = parsed.Root;

  if (!root?.Promotions?.[0]?.Promotion) {
    throw new Error("No promotions found");
  }

  const promotions = root.Promotions[0].Promotion.map((promo: any) => {
    const additional = promo.AdditionalRestrictions?.[0];
    const clubs = additional?.Clubs?.[0];

    return {
      chainId: promo.ChainId?.[0] ?? "",
      subChainId: promo.SubChainId?.[0] ?? "",
      storeId: promo.StoreId?.[0] ?? "",

      promotionId: promo.PromotionId?.[0] ? parseInt(promo.PromotionId[0]) : null,
      promotionDescription: promo.PromotionDescription?.[0] ?? "",
      
      startDate: new Date(combineDateAndTime(promo.PromotionStartDate?.[0], promo.PromotionStartHour?.[0]) ?? ""),
      
      endDate: new Date(combineDateAndTime(promo.PromotionEndDate?.[0], promo.PromotionEndHour?.[0]) ?? ""),  

      lastUpdated: new Date(promo.PromotionUpdateDate?.[0] ?? ""),
    
      isActive: additional?.AdditionalIsActive?.[0] === "1",
       
      discountedPrice: parseFloat(promo.DiscountedPrice?.[0] ?? "0"),
      
      promotionItems: (promo.PromotionItems?.[0]?.Item || []).map((item: any) => ({
        id: item.ItemCode?.[0] ?? "",
        type: parseInt(item.ItemType?.[0] ?? "0"),
        isGiftItem: item.IsGiftItem?.[0] === "1"
      })),
      
      
      promotionsTerms: {
       minQty: parseInt(promo.MinQty?.[0] ?? "0"),
       maxQty: promo.MAXQTY?.[0] ? parseInt(promo.MAXQTY[0]) : undefined,
       minNoOfItemOfered: parseInt(promo.MinNoOfItemOfered?.[0] ?? "0"),
       remarks: promo.Remarks?.[0] ?? "",

       clubs: clubs?.ClubId ? [{ clubId: parseInt(clubs.ClubId[0]) }] : [],
 
       additionalRestrictions: {
        requiresCoupon: additional?.AdditionalIsCoupon?.[0] === "1",
        requiresClubMembership: clubs?.ClubId?.[0] !== "0",
        clubId: clubs?.ClubId?.[0],
        additionalGiftCount: parseInt(additional?.AdditionalGiftCount?.[0] ?? "0")
        }
      }
    };
  });

  const outputPath = path.resolve(__dirname, "filtered_promotions.json");
  fs.writeFileSync(outputPath, JSON.stringify(promotions, null, 2), "utf8");

  return outputPath;
}

//  לאחד תאריך ושעה
function combineDateAndTime(date: string | undefined, time: string | undefined): string | null {
  if (!date) return null;
  return time ? `${date}T${time}` : date;
}
