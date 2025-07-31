// packages/frontend/src/components/alert/math.ts

import { ProductDTO } from '@smartcart/shared';
import { StoreLocationDto } from '@smartcart/shared';
import { ProductSearchResult } from './createAlertModal'; // ✅ ייבוא ProductSearchResult

// נתוני דמה למוצרים בכל החנויות.
// ✅ שימו לב: אלו עכשיו ProductSearchResult[] ולא ProductDTO[]
const dummyProductsAllResults: ProductSearchResult[] = [
    // P001 - חלב תנובה 3%
    {
        item: new ProductDTO("P001", 101, "חלב תנובה 3%", "1", "חלב 3% - תנובה", true, "חלב בקר 3% שומן, 1 ליטר", "תנובה", 6.00, 6.00, 1, 0, undefined),
        price: { pricePK: 'PRC001', itemCode: 'P001', storePK: '1', price: 6.00, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 6.00 }
    },
    {
        item: new ProductDTO("P001", 107, "חלב תנובה 3%", "2", "חלב 3% - תנובה", true, "חלב בקר 3% שומן, 1 ליטר", "תנובה", 5.50, 6.00, 1, 1, "מבצע!"),
        price: { pricePK: 'PRC007', itemCode: 'P001', storePK: '2', price: 5.50, promotionId: "PROMO1", lastUpdateDate: '2025-07-28', originalPrice: 7.00 } // מחיר מבצע
    },
    {
        item: new ProductDTO("P001", 108, "חלב תנובה 3%", "3", "חלב בקר 3% שומן, 1 ליטר", true, "חלב בקר 3% שומן, 1 ליטר", "תנובה", 6.20, 6.00, 1, 0, undefined),
        price: { pricePK: 'PRC008', itemCode: 'P001', storePK: '3', price: 6.20, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 6.20 }
    },

    // P002 - לחם אנג'ל אחיד פרוס
    {
        item: new ProductDTO("P002", 102, "לחם אנג'ל אחיד פרוס", "1", "לחם אחיד פרוס - אנג'ל", true, "לחם אחיד פרוס 750 גרם", "אנג'ל", 12.50, 16.67, 1, 0, undefined),
        price: { pricePK: 'PRC002', itemCode: 'P002', storePK: '1', price: 12.50, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 12.50 }
    },
    {
        item: new ProductDTO("P002", 109, "לחם אנג'ל אחיד פרוס", "2", "לחם אחיד פרוס - אנג'ל", true, "לחם אחיד פרוס 750 גרם", "אנג'ל", 11.00, 16.67, 1, 1, "מבצע!"),
        price: { pricePK: 'PRC009', itemCode: 'P002', storePK: '2', price: 11.00, promotionId: "PROMO2", lastUpdateDate: '2025-07-28', originalPrice: 13.00 }
    },

    // P003 - שמן זית יד מרדכי
    {
        item: new ProductDTO("P003", 103, "שמן זית יד מרדכי", "2", "שמן זית כתית מעולה - יד מרדכי", true, "שמן זית כתית מעולה, 750 מ\"ל", "יד מרדכי", 35.00, 46.67, 1, 1, "מבצע: 2 ב-60 ש\"ח"),
        price: { pricePK: 'PRC003', itemCode: 'P003', storePK: '2', price: 35.00, promotionId: 'PROM001', lastUpdateDate: '2025-07-27', originalPrice: 45.00 }
    },
    {
        item: new ProductDTO("P003", 110, "שמן זית יד מרדכי", "3", "שמן זית כתית מעולה, 750 מ\"ל", true, "שמן זית כתית מעולה, 750 מ\"ל", "יד מרדכי", 38.00, 46.67, 1, 0, undefined),
        price: { pricePK: 'PRC010', itemCode: 'P003', storePK: '3', price: 38.00, promotionId: null, lastUpdateDate: '2025-07-27', originalPrice: 45.00 }
    },

    // P004 - קפה נמס עלית 200 גרם
    {
        item: new ProductDTO("P004", 104, "קפה נמס עלית 200 גרם", "3", "קפה נמס - עלית", true, "קפה נמס מגורען, 200 גרם", "עלית", 28.00, 140.00, 1, 0, undefined),
        price: { pricePK: 'PRC004', itemCode: 'P004', storePK: '3', price: 28.00, promotionId: null, lastUpdateDate: '2025-07-26', originalPrice: 28.00 }
    },

    // P005 - יוגורט שטראוס ביו
    {
        item: new ProductDTO("P005", 105, "יוגורט שטראוס ביו", "1", "יוגורט ביו - שטראוס", true, "יוגורט ביו טבעי, 200 גרם", "שטראוס", 4.50, 22.50, 1, 0, undefined),
        price: { pricePK: 'PRC005', itemCode: 'P005', storePK: '1', price: 4.50, promotionId: null, lastUpdateDate: '2025-07-28', originalPrice: 4.50 }
    },

    // P006 - אורז סוגת בסמטי 1 ק"ג
    {
        item: new ProductDTO("P006", 106, "אורז סוגת בסמטי 1 ק\"ג", "2", "אורז בסמטי - סוגת", true, "אורז בסמטי הודי, 1 ק\"ג", "סוגת", 15.00, 15.00, 1, 1, "מבצע: 2 ב-25 ש\"ח"),
        price: { pricePK: 'PRC006', itemCode: 'P006', storePK: '2', price: 15.00, promotionId: 'PROM002', lastUpdateDate: '2025-07-27', originalPrice: 20.00 }
    },
    {
        item: new ProductDTO("P006", 111, "אורז סוגת בסמטי 1 ק\"ג", "1", "אורז בסמטי - סוגת", true, "אורז בסמטי הודי, 1 ק\"ג", "סוגת", 18.00, 15.00, 1, 0, undefined),
        price: { pricePK: 'PRC011', itemCode: 'P006', storePK: '1', price: 18.00, promotionId: null, lastUpdateDate: '2025-07-27', originalPrice: 20.00 }
    },
];

// ✅ פונקציית דמה לקבלת כל מופעי המוצר לפי itemCode מכל החנויות (מחזירה ProductSearchResult[])
export function getProductsByItemCodeAcrossStoresDummy(itemCode: string): ProductSearchResult[] {
    return dummyProductsAllResults.filter(p => p.item.itemCode === itemCode);
}


export function calculateDiscountPercentage(currentPrice: number, originalPrice: number | undefined): number {
    if (originalPrice === undefined || originalPrice <= 0 || originalPrice === currentPrice) {
        return 0;
    }
    const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
    return Math.max(0, discount);
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

export function getFilteredStores(
    selectedProduct: ProductDTO, // עדיין מקבל ProductDTO גנרי
    allStores: StoreLocationDto[],
    allProductsForSelectedItem: ProductSearchResult[], // ✅ עכשיו מקבל ProductSearchResult[]
    userLatitude: number | null,
    userLongitude: number | null,
    maxDistance: number,
    minDiscount: number
): StoreLocationDto[] {
    if (!selectedProduct || !selectedProduct.itemCode || userLatitude === null || userLongitude === null) {
        return [];
    }

    const relevantStorePKs = new Set<string>();

    allProductsForSelectedItem.forEach(productResult => { // ✅ לולאה על ProductSearchResult
        // לוודא שה-itemCode מתאים למוצר שנבחר
        if (productResult.item.itemCode === selectedProduct.itemCode && productResult.price.storePK) {
            const store = allStores.find(s => s.storePK === productResult.price.storePK);

            if (store) {
                const distance = calculateDistance(userLatitude, userLongitude, store.latitude, store.longitude);
                if (distance <= maxDistance) {
                    // ✅ קריאה לפונקציית חישוב ההנחה עם currentPrice ו-originalPrice מתוך productResult.price
                    const discount = calculateDiscountPercentage(productResult.price.price, productResult.price.originalPrice);
                    if (discount >= minDiscount) {
                        relevantStorePKs.add(store.storePK);
                    }
                }
            }
        }
    });

    return allStores.filter(store => relevantStorePKs.has(store.storePK));
}