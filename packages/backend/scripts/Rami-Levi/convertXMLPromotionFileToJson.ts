import * as fs from "fs";
import * as xml2js from "xml2js";
import * as path from "path";
import * as zlib from "zlib";

export async function convertXMLPromotionFileToJson(xmlContent: string): Promise<string | undefined> {
    try {
        if (!xmlContent) {
            throw new Error("Invalid XML content");
        }
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xmlContent);
        const FieldNamesArray = getFieldNamesAsArray();

        const filtered = await filterPromotions(JSON.stringify(result), FieldNamesArray);

        if (filtered) {
            const jsonFilePath = path.resolve(__dirname, "xmlContent.json");
            fs.writeFileSync(jsonFilePath, JSON.stringify(filtered, null, 2), "utf-8");
            return jsonFilePath;
        }
        return undefined; 
    } catch (err) {
        throw new Error(err instanceof Error ? err.message : String(err));
    }
}

export async function filterPromotions(jsonData: string, fields: string[]): Promise<any> {
    try {
        const data = JSON.parse(jsonData); 
        const root = data.Root || data;

        if (!root.Promotions || !Array.isArray(root.Promotions)) {
            throw new Error("Promotions not found or not an array");
        }

        const filteredPromotions = root.Promotions.map((promotionObject: any) => {
            const promotions = promotionObject.Promotion || []; 
            return promotions.map((promotion: any) => {
                const filtered: any = {};
                fields.forEach(field => {
                    switch (field) {
                        case 'promotionId':
                            filtered.promotionId = promotion.PromotionId ? promotion.PromotionId[0] : null;
                            break;
                        case 'promotionDescription':
                            filtered.promotionDescription = promotion.PromotionDescription ? promotion.PromotionDescription[0] : null;
                            break;
                        case 'startDate':
                            filtered.startDate = promotion.PromotionStartDate ? promotion.PromotionStartDate[0] : null;
                            break;
                        case 'endDate':
                            filtered.endDate = promotion.PromotionEndDate ? promotion.PromotionEndDate[0] : null;
                            break;
                        case 'lastUpdated':
                            filtered.lastUpdated = promotion.PromotionUpdateDate ? promotion.PromotionUpdateDate[0] : null;
                            break;
                        case 'minQty':
                            filtered.minQty = promotion.MinQty ? promotion.MinQty[0] : null;
                            break;
                        case 'discountedPrice':
                            filtered.discountedPrice = promotion.DiscountedPrice ? promotion.DiscountedPrice[0] : null;
                            break;
                        case 'additionalRestrictions':
                            filtered.additionalRestrictions = promotion.AdditionalRestrictions ? promotion.AdditionalRestrictions.map((restriction: any) => ({
                                AdditionalIsCoupon: restriction.AdditionalIsCoupon[0],
                                AdditionalGiftCount: restriction.AdditionalGiftCount[0],
                                AdditionalIsTotal: restriction.AdditionalIsTotal[0],
                                AdditionalIsActive: restriction.AdditionalIsActive[0],
                            })) : [];
                            break;
                    }
                });
                return filtered; 
            });
        }).flat(); 
        return { Promotions: filteredPromotions };
    } catch (error) {
        throw new Error(`Error filtering promotions: ${error instanceof Error ? error.message : String(error)}`);
    }
}

export function getFieldNamesAsArray(): string[] {
    const promotionFields = [
        "promotionId",
        "promotionDescription",
        "startDate",
        "endDate",
        "lastUpdated",
        "isActive",
        "originalPrice",
        "discountedPrice",
        "discountAmount",
        "discountPercentage",
        "promotionItems",
        "conditionsOfPromo"
    ];

    const conditionsFields = [
        "minQty",
        "maxQty",
        "clubs",
        "additionalRestrictions",
        "minPurchaseAmnt",
        "minNoOfItemOfered",
        "remarks"
    ];

    const clubFields = [
        "clubId"
    ];

    const additionalRestrictionsFields = [
        "requiresCoupon",
        "requiresClubMembership",
        "clubId",
        "additionalGiftCount",
        "additionalIsTotal",
        "additionalIsActive"
    ];

    return [
        ...promotionFields,
        ...conditionsFields,
        ...clubFields,
        ...additionalRestrictionsFields
    ];
}