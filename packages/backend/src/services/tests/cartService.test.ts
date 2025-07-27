import { getRelevantPromotionsForCart } from "../cartService";
import { Promotion } from "@smartcart/shared";
import { Price } from "@smartcart/shared";
import { shoppingCartTotalSummary } from '../cartService';
import { ProductDTO } from '@smartcart/shared/src/dto/Product.dto';

describe("getRelevantPromotionsForCart", () => {

    const baseCartItem: Price = {
        priceId: 1,
        storePK: "1",
        itemId: 1,
        itemCode: 1,
        price: 10,
        priceUpdateDate: new Date("2025-01-01"),
        unitQuantity: "1",
        quantity: 1,
        unitOfMeasure: "ml",
        isWeighted: false,
        quantityInPackage: 1,
        unitOfMeasurePrice: 10,
        allowDiscount: true,
    };
    const basePromo: Promotion = {
        promotionId: 1,
        storePK: "1",
        promotionDescription: "מבצע בסיסי",
        isActive: true,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        requiresCoupon: false,
        requiresClubMembership: false,
        promotionItemsCode: [1, 2],
        minPurchaseAmount: 1,
        minQuantity: 1,
        clubId: 1,
        lastUpdated: new Date(),
        discountedPrice: 5,
    };


    it("מחזיר מבצע פעיל ורלוונטי", () => {
        const promos = [basePromo];
        const result = getRelevantPromotionsForCart([baseCartItem], promos);
        expect(result).toHaveLength(1);
    });

    it("לא מחזיר מבצע לא פעיל", () => {
        const promos = [{ ...basePromo, isActive: false }];
        const result = getRelevantPromotionsForCart([baseCartItem], promos);
        expect(result).toHaveLength(0);
    });

    it("לא מחזיר מבצע מחוץ לטווח תאריכים", () => {
        const promos = [{ ...basePromo, startDate: new Date("2026-01-01") }];
        const result = getRelevantPromotionsForCart([baseCartItem], promos);
        expect(result).toHaveLength(0);
    });

    it("בודק דרישת קופון", () => {
        const promos = [{ ...basePromo, requiresCoupon: true }];
        const result = getRelevantPromotionsForCart([baseCartItem], promos, { hasCoupon: false });
        expect(result).toHaveLength(0);
        const result2 = getRelevantPromotionsForCart([baseCartItem], promos, { hasCoupon: true });
        expect(result2).toHaveLength(1);
    });

    it("בודק דרישת מועדון", () => {
        const promos = [{ ...basePromo, requiresClubMembership: true, clubId: 5 }];
        const result = getRelevantPromotionsForCart([baseCartItem], promos, { isClubMember: false });
        expect(result).toHaveLength(0);
        const result2 = getRelevantPromotionsForCart([baseCartItem], promos, { isClubMember: true, clubId: 5 });
        expect(result2).toHaveLength(1);
        const result3 = getRelevantPromotionsForCart([baseCartItem], promos, { isClubMember: true, clubId: 2 });
        expect(result3).toHaveLength(0);
    });

    it("בודק מינימום סכום קנייה", () => {
        const promos = [{ ...basePromo, minPurchaseAmount: 5 }];
        const result = getRelevantPromotionsForCart([{ ...baseCartItem, quantity: 2 }], promos);
        expect(result).toHaveLength(0);
        const result2 = getRelevantPromotionsForCart([{ ...baseCartItem, quantity: 6 }], promos);
        expect(result2).toHaveLength(1);
    });
    it("בודק מינימום ומקסימום סכום קנייה", () => {
        const promos = [
            { ...basePromo, minQuantity: 5, maxQuantity: 10, promotionItemsCode: [1, 2] }
        ];

        // בדיקה כאשר הכמות נמוכה מהמינימום
        const result1 = getRelevantPromotionsForCart([{ ...baseCartItem, itemId: 1, quantity: 2 }],promos );
        expect(result1).toHaveLength(0);

        // בדיקה כאשר הכמות גבוהה מהמינימום אך נמוכה מהמקסימום
        const result2 = getRelevantPromotionsForCart([{ ...baseCartItem, itemId: 1, quantity: 6 }], promos);
        expect(result2).toHaveLength(1);

        // בדיקה כאשר הכמות גבוהה מהמקסימום
        const result3 = getRelevantPromotionsForCart([{ ...baseCartItem, itemId: 1, quantity: 11 }], promos);
        expect(result3).toHaveLength(0);

        // בדיקה כאשר הכמות שווה למינימום
        const result4 = getRelevantPromotionsForCart([{ ...baseCartItem, itemId: 1, quantity: 5 }], promos);
        expect(result4).toHaveLength(1);

        // בדיקה כאשר maxQuantity הוא undefined
        const promosWithoutMax = [
            { ...basePromo, minQuantity: 5, promotionItemsCode: [1,3] }
        ];
        const result5 = getRelevantPromotionsForCart([{ ...baseCartItem, itemId: 1, quantity: 6 }], promosWithoutMax);
        expect(result5).toHaveLength(1);
    });


    it("בודק מינימום כמות פריטים במבצע", () => {
        const promos = [{ ...basePromo, minQuantity: 3 }];
        const result = getRelevantPromotionsForCart([{ ...baseCartItem, quantity: 2 }], promos);
        expect(result).toHaveLength(0);
        const result2 = getRelevantPromotionsForCart([{ ...baseCartItem, quantity: 3 }], promos);
        expect(result2).toHaveLength(1);
    });

    it("בודק שאין החזרה של מבצע לא רלוונטי לפריטים בסל", () => {
        const promos = [{ ...basePromo, promotionItemsCode: [99] }];
        const result = getRelevantPromotionsForCart([baseCartItem], promos);
        expect(result).toHaveLength(0);
    });
});


describe('shoppingCartTotalSummary', () => {
  it('calculates total considering latest active promotions per item', async () => {
   const cart: ProductDTO[] = [
  new ProductDTO(101, 'P1', 'Milk', 'store1', 'item1', true, 'Desc1', 'BrandA', 10, 10, '1L'),
  new ProductDTO(102, 'P2', 'Bread', 'store1', 'item2', true, 'Desc2', 'BrandB', 5, 5, '1pc'),
  new ProductDTO(103, 'P3', 'Cheese', 'store1', 'item3', true, 'Desc3', 'BrandC', 15, 15, '250g')
];

    const promotions: Promotion[] = [
      {
        promotionId: 1,
        storePK: 'store1',
        promotionDescription: 'Old promo Milk',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        lastUpdated: new Date('2024-01-01'),
        isActive: true,
        discountedPrice: 8,
        promotionItemsCode: [101],
        requiresCoupon: false,
        requiresClubMembership: false
      },
      {
        promotionId: 2,
        storePK: 'store1',
        promotionDescription: 'New promo Milk',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-12-31'),
        lastUpdated: new Date('2024-06-01'),
        isActive: true,
        discountedPrice: 7,
        promotionItemsCode: [101],
        requiresCoupon: false,
        requiresClubMembership: false
      },
      {
        promotionId: 3,
        storePK: 'store1',
        promotionDescription: 'Promo Bread',
        startDate: new Date('2024-05-01'),
        endDate: new Date('2024-12-31'),
        lastUpdated: new Date('2024-05-01'),
        isActive: true,
        discountedPrice: 4,
        promotionItemsCode: [102],
        requiresCoupon: false,
        requiresClubMembership: false
      },
      {
        promotionId: 4,
        storePK: 'store1',
        promotionDescription: 'Inactive Promo Cheese',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-01'),
        lastUpdated: new Date('2024-02-01'),
        isActive: false,
        discountedPrice: 1,
        promotionItemsCode: [103],
        requiresCoupon: false,
        requiresClubMembership: false
      }
    ];

    const total = await shoppingCartTotalSummary(cart, promotions);

    // Milk uses latest promo (7), Bread uses promo (4), Cheese no active promo (15)
    expect(total).toBe(7 + 4 + 15);
  });
});