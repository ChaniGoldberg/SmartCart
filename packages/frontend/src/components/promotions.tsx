import React, { useEffect, useState } from 'react';
import { Promotion } from '@smartcart/shared/src/promotion';

interface PromotionsProps {
  storeId: number;
}

export const Promotions: React.FC<PromotionsProps> = ({ storeId }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    setPromotions([
      {
        promotionId: 1,
        storeId: 101,
        promotionDescription: "מבצע קיץ על תפוחים",
        startDate: new Date("2025-06-01T00:00:00"),
        endDate: new Date("2025-06-30T23:59:59"),
        lastUpdated: new Date(),
        isActive: true,
        originalPrice: 5.0,
        discountedPrice: 3.5,
        discountAmount: 1.5,
        discountPercentage: 30,
        promotionItemsCode: [1001, 1002],
        minQuantity: 1,
        maxQuantity: 10,
        requiresCoupon: false,
        requiresClubMembership: true,
        clubId: 123,
        additionalGiftCount: 0,
        minPurchaseAmount: 20,
        minNumberOfItemOfered: 1,
        remarks: "בתוקף עד גמר המלאי"
      },
      {
        promotionId: 2,
        storeId: 102,
        promotionDescription: "הנחה מיוחדת על מוצרי חלב",
        startDate: new Date("2025-07-01T00:00:00"),
        endDate: new Date("2025-07-15T23:59:59"),
        lastUpdated: new Date(),
        isActive: false,
        discountedPrice: 4.0,
        promotionItemsCode: [2001],
        requiresCoupon: true,
        requiresClubMembership: false,
        remarks: "רק לחברי מועדון עם קופון תקף"
      }
    ]);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-md shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">מבצעים לחנות {storeId}</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gradient-to-r from-[#1abc9c] via-[#a0f0e0] to-[#16a085]">
            <tr>
              <th className="py-3 px-6 text-right">תיאור המבצע</th>
              <th className="py-3 px-6 text-right">תוקף</th>
              <th className="py-3 px-6 text-right">מחיר מקורי</th>
              <th className="py-3 px-6 text-right">מחיר אחרי הנחה</th>
              <th className="py-3 px-6 text-right">הנחה (₪ / %)</th>
              <th className="py-3 px-6 text-right">הערות</th>
            </tr>
          </thead>

          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.promotionId} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-4 px-6 text-right text-gray-700 font-semibold">{promo.promotionDescription}</td>
                <td className="py-4 px-6 text-right text-gray-600">
                  {promo.startDate.toLocaleDateString()} - {promo.endDate.toLocaleDateString()}
                </td>
                <td className="py-4 px-6 text-right text-gray-600">
                  {promo.originalPrice ? promo.originalPrice.toFixed(2) + ' ₪' : 'לא ידוע'}
                </td>
                <td className="py-4 px-6 text-right text-gray-600">{promo.discountedPrice.toFixed(2)} ₪</td>
                <td className="py-4 px-6 text-right text-gray-600">
                  {promo.discountAmount !== undefined ? `${promo.discountAmount.toFixed(2)} ₪` : ''}
                  {promo.discountPercentage !== undefined ? ` / ${promo.discountPercentage.toFixed(2)}%` : ''}
                </td>
                <td className="py-4 px-6 text-right text-gray-600">
                  {promo.requiresCoupon && <p className="text-red-600 font-bold">⚠ נדרש קופון</p>}
                  {promo.requiresClubMembership && <p className="text-red-600 font-bold">⚠ נדרשת חברות מועדון</p>}
                  {promo.remarks && <p>{promo.remarks}</p>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};