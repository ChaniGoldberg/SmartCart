
import React, { useEffect, useState } from 'react';
import { Promotion } from '@smartcart/shared/src/promotion';

interface PromotionsProps {
  storePk: string;
}

export const Promotions: React.FC<PromotionsProps> = ({ storePk }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await fetch(`/api/promotions/by-id/${storePk}`)
          ;
        if (!response.ok) {
          throw new Error("שגיאה בטעינת המבצעים");
        }
        const data = await response.json();

        const withMappedFields = data.map((promo: any) => ({
          promotionId: promo.promotion_id,
          promotionDescription: promo.promotion_description,
          startDate: new Date(promo.start_date),
          endDate: new Date(promo.end_date),
          originalPrice: promo.original_price,
          discountedPrice: promo.discounted_price,
          discountAmount: promo.discount_amount,
          discountPercentage: promo.discount_percentage,
          requiresCoupon: promo.requires_coupon,
          requiresClubMembership: promo.requires_club_membership,
          remarks: promo.remarks,
        }));


        setPromotions(withMappedFields);
      } catch (err: any) {
        console.error("שגיאה בטעינת המבצעים:", err.message);
      }
    };

    fetchPromotions();
  }, [storePk]);



  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-md shadow-md mt-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">מבצעים לחנות {storePk}</h2>

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
                <td className="py-4 px-6 text-right text-gray-700 font-semibold">
                  {promo.promotionDescription}
                </td>

                <td className="py-4 px-6 text-right text-gray-600">
                  {promo.startDate?.toLocaleDateString?.()} - {promo.endDate?.toLocaleDateString?.()}
                </td>

                <td className="py-4 px-6 text-right text-gray-600">
                  {typeof promo.originalPrice === 'number'
                    ? promo.originalPrice.toFixed(2) + ' ₪'
                    : 'לא ידוע'}
                </td>

                <td className="py-4 px-6 text-right text-gray-600">
                  {typeof promo.discountedPrice === 'number'
                    ? promo.discountedPrice.toFixed(2) + ' ₪'
                    : 'לא ידוע'}
                </td>

                <td className="py-4 px-6 text-right text-gray-600">
                  {typeof promo.discountAmount === 'number'
                    ? `${promo.discountAmount.toFixed(2)} ₪`
                    : ''}
                  {typeof promo.discountPercentage === 'number'
                    ? ` / ${promo.discountPercentage.toFixed(2)}%`
                    : ''}
                </td>

                <td className="py-4 px-6 text-right text-gray-600">
                  {promo.requiresCoupon && (
                    <p className="text-red-600 font-bold">⚠ נדרש קופון</p>
                  )}
                  {promo.requiresClubMembership && (
                    <p className="text-red-600 font-bold">⚠ נדרשת חברות מועדון</p>
                  )}
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

